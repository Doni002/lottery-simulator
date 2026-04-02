import {
  MatchSummary,
  PersistedTicketSnapshot,
} from '../types/simulation.types';
import { calculateMatches } from './simulation-number.utils';

export function incrementMatchBucket(
  summary: MatchSummary,
  matchCount: number,
): void {
  if (matchCount === 2) summary.twoMatches++;
  if (matchCount === 3) summary.threeMatches++;
  if (matchCount === 4) summary.fourMatches++;
  if (matchCount === 5) summary.fiveMatches++;
}

export function summarizePersistedMatches(
  tickets: PersistedTicketSnapshot[],
): MatchSummary {
  const summary = createEmptyMatchSummary();

  for (const ticket of tickets) {
    const { matchCount } = calculateMatches(
      ticket.winningNumbers,
      ticket.ticketNumbers,
    );
    incrementMatchBucket(summary, matchCount);
  }

  return summary;
}

function createEmptyMatchSummary(): MatchSummary {
  return {
    twoMatches: 0,
    threeMatches: 0,
    fourMatches: 0,
    fiveMatches: 0,
  };
}