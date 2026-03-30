import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from '../dto/requests/create-session.dto';
import { UpdateCustomNumbersDto } from '../dto/requests/update-custom-numbers.dto';
import { UpdateDrawSpeedDto } from '../dto/requests/update-draw-speed.dto';
import { UpdateRandomSeedDto } from '../dto/requests/update-random-seed.dto';
import {
  MatchSummary,
  SimulationCompletePayload,
  SimulationProgressPayload,
  SimulationSession,
} from '../types/simulation.types';
import {
  DEFAULT_DRAW_SPEED_MS,
  LOTTERY_PRIZE,
  MAX_SIMULATION_DRAWS,
  MIN_PERSISTED_MATCH_COUNT,
  REQUIRED_NUMBERS,
} from '../constants/simulation.constants';
import { WEEKS_PER_YEAR } from '../../common/constants/time.constants';
import {
  calculateMatches,
  generateUniqueNumbers,
} from '../utils/simulation-number.utils';
import { SimulationLockService } from './simulation-lock.service';
import { SimulationSessionService } from './simulation-session.service';
import { SimulationPersistenceService } from './simulation-persistence.service';

@Injectable()
export class SimulationService {
  constructor(
    private readonly lockService: SimulationLockService,
    private readonly sessionService: SimulationSessionService,
    private readonly persistenceService: SimulationPersistenceService,
  ) {}

  async tryAcquireSimulationLock(sessionId: string) {
    return this.lockService.tryAcquireSimulationLock(sessionId);
  }

  async releaseSimulationLock(sessionId: string) {
    await this.lockService.releaseSimulationLock(sessionId);
  }

  async createSession(dto: CreateSessionDto) {
    return this.sessionService.createSession(dto);
  }

  async getSession(sessionId: string) {
    return this.sessionService.getSession(sessionId);
  }

  async updateDrawSpeed(sessionId: string, dto: UpdateDrawSpeedDto) {
    return this.sessionService.updateDrawSpeed(sessionId, dto);
  }

  async updateRandomSeed(sessionId: string, dto: UpdateRandomSeedDto) {
    return this.sessionService.updateRandomSeed(sessionId, dto);
  }

  async updateCustomNumbers(sessionId: string, dto: UpdateCustomNumbersDto) {
    return this.sessionService.updateCustomNumbers(sessionId, dto);
  }

  async runSimulationStep(sessionId: string) {
    const session = await this.sessionService.getSessionForSimulation(sessionId);
    const step = await this.runSimulationStepAndCollect(sessionId, session);
    const matches =
      await this.persistenceService.calculatePersistedMatchSummary(sessionId);
    const { yearsSpent, costOfTickets } = this.calculateSimulationStats(
      step.numberOfTickets,
    );

    return {
      numberOfTickets: step.numberOfTickets,
      yearsSpent,
      costOfTickets,
      matches,
      winningNumbers: step.winningNumbers,
      yourNumbers: step.ticketNumbers,
    };
  }

  async runSimulationUntilStop(
    sessionId: string,
    onProgress: (payload: SimulationProgressPayload) => void | Promise<void>,
  ): Promise<SimulationCompletePayload> {
    const session = await this.sessionService.getSessionForSimulation(sessionId);
    const matches =
      await this.persistenceService.calculatePersistedMatchSummary(sessionId);

    let lastProgress: SimulationProgressPayload | null = null;

    for (let drawIndex = 1; drawIndex <= MAX_SIMULATION_DRAWS; drawIndex++) {
      const step = await this.runSimulationStepAndCollect(sessionId, session);
      this.incrementMatchSummary(matches, step.matchCount);

      const { yearsSpent, costOfTickets } = this.calculateSimulationStats(
        step.numberOfTickets,
      );
      const progress: SimulationProgressPayload = {
        sessionId,
        drawIndex,
        numberOfTickets: step.numberOfTickets,
        yearsSpent,
        costOfTickets,
        matches: { ...matches },
        winningNumbers: step.winningNumbers,
        yourNumbers: step.ticketNumbers,
        matchCount: step.matchCount,
        isPersistedDraw: this.shouldPersist(step.matchCount),
      };

      await onProgress(progress);
      lastProgress = progress;

      if (step.matchCount === REQUIRED_NUMBERS) {
        return {
          ...progress,
          stopReason: 'fiveMatchHit',
          totalDrawsRun: drawIndex,
        };
      }

      if (drawIndex < MAX_SIMULATION_DRAWS) {
        await this.waitForNextDraw(session.drawSpeed);
      }
    }

    if (!lastProgress) {
      throw new NotFoundException('Unable to produce simulation progress');
    }

    return {
      ...lastProgress,
      stopReason: 'maxYearsReached',
      totalDrawsRun: MAX_SIMULATION_DRAWS,
    };
  }

  private async runSimulationStepAndCollect(
    sessionId: string,
    session: SimulationSession,
  ) {
    const winningNumbers = generateUniqueNumbers();
    const ticketNumbers = this.resolveTicketNumbers(session);
    const { matchCount } = calculateMatches(winningNumbers, ticketNumbers);

    if (this.shouldPersist(matchCount)) {
      await this.persistenceService.persistWinningDrawAndTicket(
        sessionId,
        winningNumbers,
        ticketNumbers,
      );
    }

    const numberOfTickets =
      await this.persistenceService.incrementTicketsPlayed(sessionId);

    return {
      winningNumbers,
      ticketNumbers,
      matchCount,
      numberOfTickets,
    };
  }

  private incrementMatchSummary(summary: MatchSummary, matchCount: number) {
    if (!this.shouldPersist(matchCount)) {
      return;
    }

    if (matchCount === 2) summary.twoMatches++;
    if (matchCount === 3) summary.threeMatches++;
    if (matchCount === 4) summary.fourMatches++;
    if (matchCount === 5) summary.fiveMatches++;
  }

  private async waitForNextDraw(drawSpeedMs: number) {
    const delayMs = Number.isFinite(drawSpeedMs)
      ? Math.max(0, Math.floor(drawSpeedMs))
      : DEFAULT_DRAW_SPEED_MS;

    await new Promise<void>((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }

  private resolveTicketNumbers(session: SimulationSession): number[] {
    const customNumbers = session.customNumbers;

    if (customNumbers && customNumbers.length > 0 && !session.randomSeedEnabled) {
      return customNumbers;
    }

    return generateUniqueNumbers();
  }

  private shouldPersist(matchCount: number): boolean {
    return matchCount >= MIN_PERSISTED_MATCH_COUNT;
  }

  private calculateSimulationStats(numberOfTickets: number) {
    return {
      yearsSpent: Math.floor(numberOfTickets / WEEKS_PER_YEAR),
      costOfTickets: numberOfTickets * LOTTERY_PRIZE,
    };
  }
}