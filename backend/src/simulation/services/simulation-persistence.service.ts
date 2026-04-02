import { Injectable } from '@nestjs/common';
import {
  MatchSummary,
  PersistedTicketSnapshot,
} from '../types/simulation.types';
import { toNumberArray } from '../utils/simulation-number.utils';
import { summarizePersistedMatches } from '../utils/match-summary.utils';
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

    return summarizePersistedMatches(ticketSnapshots);
  }

  async persistWinningDrawAndTicket(
    sessionId: string,
    winningNumbers: number[],
    ticketNumbers: number[],
  ) {
    await this.prisma.$transaction(async (tx) => {
      const draw = await tx.draw.create({
        data: {
          sessionId,
          winningNumbers,
          drawDate: new Date(),
        },
      });

      await tx.ticket.create({
        data: {
          sessionId,
          drawId: draw.id,
          numbers: ticketNumbers,
        },
      });
    });
  }
}