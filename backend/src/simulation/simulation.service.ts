import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from '../common/dto/session.dto';
import {
  MatchSummary,
  PersistedTicketSnapshot,
  SimulationSession,
} from '../common/types/lottery.types';
import { DEFAULT_DRAW_SPEED_MS } from '../common/constants/lottery.constants';
import {
  calculateMatches,
  calculateSimulationStats,
  generateUniqueNumbers,
  resolveTicketNumbers,
  shouldPersist,
  summarizeMatches,
  toNumberArray,
} from '../common/utils/simulation.util';

@Injectable()
export class SimulationService {
  constructor(private prisma: PrismaService) {}

  async createSession(dto: CreateSessionDto) {
    const randomSeedEnabled = dto.randomSeedEnabled ?? true;
    const session = await this.prisma.session.create({
      data: {
        drawSpeed: dto.drawSpeed ?? DEFAULT_DRAW_SPEED_MS,
        randomSeedEnabled,
        customNumbers: dto.customNumbers ?? undefined,
      },
    });

    return session;
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        tickets: true,
        draws: true,
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async runSimulationStep(sessionId: string) {
    const session = await this.getSessionForSimulation(sessionId);
    const winningNumbers = generateUniqueNumbers();
    const ticketNumbers = resolveTicketNumbers(session);
    const { matchCount } = calculateMatches(
      winningNumbers,
      ticketNumbers,
    );

    if (shouldPersist(matchCount)) {
      const draw = await this.saveDraw(sessionId, winningNumbers);
      await this.saveTicket(sessionId, draw.id, ticketNumbers);
    }

    const numberOfTickets = await this.incrementTicketsPlayed(sessionId);
    const matches = await this.calculatePersistedMatchSummary(sessionId);
    const { yearsSpent, costOfTickets } = calculateSimulationStats(numberOfTickets);

    return {
      numberOfTickets,
      yearsSpent,
      costOfTickets,
      matches,
      winningNumbers,
      yourNumbers: ticketNumbers,
    };
  }

  private async getSessionForSimulation(
    sessionId: string,
  ): Promise<SimulationSession> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      select: { customNumbers: true, randomSeedEnabled: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return {
      randomSeedEnabled: session.randomSeedEnabled,
      customNumbers: Array.isArray(session.customNumbers)
        ? toNumberArray(session.customNumbers)
        : null,
    };
  }

  private async calculatePersistedMatchSummary(
    sessionId: string,
  ): Promise<MatchSummary> {
    const persistedTickets = await this.prisma.ticket.findMany({
      where: { sessionId },
      select: {
        numbers: true,
        draw: {
          select: {
            winningNumbers: true,
          },
        },
      },
    });

    const ticketSnapshots = persistedTickets.reduce<PersistedTicketSnapshot[]>(
      (snapshots, ticket) => {
        const winningNumbers = toNumberArray(ticket.draw?.winningNumbers);
        const ticketNumbers = toNumberArray(ticket.numbers);

        if (winningNumbers.length === 0 || ticketNumbers.length === 0) {
          return snapshots;
        }

        snapshots.push({ winningNumbers, ticketNumbers });
        return snapshots;
      },
      [],
    );

    return summarizeMatches(ticketSnapshots);
  }

  private async incrementTicketsPlayed(sessionId: string) {
    const updatedSession = await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        ticketsPlayed: {
          increment: 1,
        },
      },
      select: {
        ticketsPlayed: true,
      },
    });

    return updatedSession.ticketsPlayed;
  }

  private async saveDraw(sessionId: string, winningNumbers: number[]) {
    return this.prisma.draw.create({
      data: {
        sessionId,
        winningNumbers,
        drawDate: new Date(),
      },
    });
  }

  private async saveTicket(sessionId: string, drawId: number, ticketNumbers: number[]) {
    await this.prisma.ticket.create({
      data: {
        sessionId,
        drawId,
        numbers: ticketNumbers,
      },
    });
  }
}