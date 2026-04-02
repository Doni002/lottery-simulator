import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { CreateSessionDto } from '../dto/requests/create-session.dto';
import { UpdateDrawSpeedDto } from '../dto/requests/update-draw-speed.dto';
import {
  MatchSummary,
  SimulationCompletePayload,
  SimulationPausedPayload,
  SimulationProgressPayload,
  SimulationSession,
} from '../types/simulation.types';
import {
  StartSimulationResponse,
  StopSimulationResponse,
} from '../dto/responses/simulation.response.dto';
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
import { incrementMatchBucket } from '../utils/match-summary.utils';
import { SimulationLockService } from './simulation-lock.service';
import { SimulationSessionService } from './simulation-session.service';
import { SimulationPersistenceService } from './simulation-persistence.service';
import { SimulationGateway } from '../simulation.gateway';

@Injectable()
export class SimulationService {
  private readonly ticketCounts = new Map<string, number>();

  constructor(
    private readonly lockService: SimulationLockService,
    private readonly sessionService: SimulationSessionService,
    private readonly persistenceService: SimulationPersistenceService,
    @Inject(forwardRef(() => SimulationGateway))
    private readonly gateway: SimulationGateway,
  ) {}

  async tryAcquireSimulationLock(sessionId: string) {
    return this.lockService.tryAcquireSimulationLock(sessionId);
  }

  async releaseSimulationLock(sessionId: string, isFinal = false) {
    await this.lockService.releaseSimulationLock(sessionId);
    if (isFinal) {
      this.ticketCounts.delete(sessionId);
    }
  }

  requestPause(sessionId: string): void {
    this.lockService.requestPause(sessionId);
  }

  async startSimulation(sessionId: string): Promise<StartSimulationResponse> {
    const normalizedId = sessionId.trim();

    if (!normalizedId) {
      return { accepted: false, message: 'sessionId is required' };
    }

    const lock = await this.lockService.tryAcquireSimulationLock(normalizedId);

    if (!lock.acquired) {
      return { accepted: false, message: lock.message };
    }

    void this.gateway.executeSimulationRun(normalizedId);
    return { accepted: true, message: 'Simulation started' };
  }

  stopSimulation(sessionId: string): StopSimulationResponse {
    const normalizedId = sessionId.trim();

    if (!normalizedId) {
      return { accepted: false, message: 'sessionId is required' };
    }

    this.lockService.requestPause(normalizedId);
    return { accepted: true, message: 'Stop requested' };
  }

  async createSession(dto: CreateSessionDto) {
    return this.sessionService.createSession(dto);
  }

  async updateDrawSpeed(sessionId: string, dto: UpdateDrawSpeedDto) {
    const session = await this.sessionService.updateDrawSpeed(sessionId, dto);
    this.lockService.setLiveDrawSpeed(sessionId, dto.drawSpeed);
    return session;
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
  ): Promise<SimulationCompletePayload | SimulationPausedPayload> {
    const session = await this.sessionService.getSessionForSimulation(sessionId);
    this.lockService.setLiveDrawSpeed(sessionId, session.drawSpeed);

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

      if (this.lockService.isPauseRequested(sessionId)) {
        this.lockService.clearPauseRequest(sessionId);
        return { sessionId, message: 'Simulation paused' };
      }

      if (drawIndex < MAX_SIMULATION_DRAWS) {
        await this.waitForNextDraw(sessionId, session.drawSpeed);
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

    const numberOfTickets = this.incrementTicketCount(sessionId);

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

    incrementMatchBucket(summary, matchCount);
  }

  private async waitForNextDraw(sessionId: string, fallbackDrawSpeedMs: number) {
    const startedAt = Date.now();

    while (true) {
      const currentSpeed = this.lockService.getLiveDrawSpeed(
        sessionId,
        fallbackDrawSpeedMs,
      );
      const targetDelayMs = Number.isFinite(currentSpeed)
        ? Math.max(0, Math.floor(currentSpeed))
        : DEFAULT_DRAW_SPEED_MS;
      const elapsedMs = Date.now() - startedAt;
      const remainingMs = targetDelayMs - elapsedMs;

      if (remainingMs <= 0) {
        return;
      }

      await new Promise<void>((resolve) => {
        setTimeout(resolve, Math.min(remainingMs, 50));
      });
    }
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

  private incrementTicketCount(sessionId: string): number {
    const currentCount = this.ticketCounts.get(sessionId) ?? 0;
    const nextCount = currentCount + 1;
    this.ticketCounts.set(sessionId, nextCount);
    return nextCount;
  }
}