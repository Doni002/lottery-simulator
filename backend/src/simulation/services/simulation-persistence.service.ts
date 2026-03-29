import { Injectable } from '@nestjs/common';
import {
  MatchSummary,
  PersistedTicketSnapshot,
} from '../types/simulation.types';
import { calculateMatches, toNumberArray } from '../utils/simulation-number.utils';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SimulationPersistenceService {
  constructor(private readonly prisma: PrismaService) {}

  async calculatePersistedMatchSummary(sessionId: string): Promise<MatchSummary> {
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

    return this.summarizeMatches(ticketSnapshots);
  }

  async persistWinningDrawAndTicket(
    sessionId: string,
    winningNumbers: number[],
    ticketNumbers: number[],
  ) {
    const draw = await this.prisma.draw.create({
      data: {
        sessionId,
        winningNumbers,
        drawDate: new Date(),
      },
    });

    await this.prisma.ticket.create({
      data: {
        sessionId,
        drawId: draw.id,
        numbers: ticketNumbers,
      },
    });
  }

  async incrementTicketsPlayed(sessionId: string) {
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

  private summarizeMatches(tickets: PersistedTicketSnapshot[]): MatchSummary {
    const summary = this.createEmptyMatchSummary();

    for (const ticket of tickets) {
      const { matchCount } = calculateMatches(
        ticket.winningNumbers,
        ticket.ticketNumbers,
      );

      this.incrementMatchSummary(summary, matchCount);
    }

    return summary;
  }

  private createEmptyMatchSummary(): MatchSummary {
    return {
      twoMatches: 0,
      threeMatches: 0,
      fourMatches: 0,
      fiveMatches: 0,
    };
  }

  private incrementMatchSummary(summary: MatchSummary, matchCount: number) {
    if (matchCount === 2) summary.twoMatches++;
    if (matchCount === 3) summary.threeMatches++;
    if (matchCount === 4) summary.fourMatches++;
    if (matchCount === 5) summary.fiveMatches++;
  }
}
