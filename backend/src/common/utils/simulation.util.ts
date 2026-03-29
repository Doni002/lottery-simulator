import {
  LOTTERY_PRIZE,
  MAX_LOTTO_NUM,
  MIN_PERSISTED_MATCH_COUNT,
  REQUIRED_NUMBERS,
} from '../../simulation/constants/simulation.constants';
import { WEEKS_PER_YEAR } from '../constants/time.constants';
import {
  MatchSummary,
  PersistedTicketSnapshot,
  SimulationSession,
  SimulationStats,
} from '../../simulation/types/simulation.types';

export function generateUniqueNumbers(
  count = REQUIRED_NUMBERS,
  maxNumber = MAX_LOTTO_NUM,
): number[] {
  if (count <= 0 || count > maxNumber) {
    throw new Error('count must be between 1 and maxNumber');
  }

  const numbers: number[] = [];
  const pool = Array.from({ length: maxNumber }, (_, index) => index + 1);

  while (numbers.length < count) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    numbers.push(pool.splice(randomIndex, 1)[0]);
  }

  return numbers;
}

export function calculateMatches(
  winningNumbers: number[],
  ticketNumbers: number[],
): {
  matchCount: number;
  matchingNumbers: number[];
} {
  const matchingNumbers = ticketNumbers.filter((num) =>
    winningNumbers.includes(num),
  );

  return {
    matchCount: matchingNumbers.length,
    matchingNumbers: matchingNumbers.sort((a, b) => a - b),
  };
}

export function resolveTicketNumbers(session: SimulationSession): number[] {
  const customNumbers = session.customNumbers;

  if (customNumbers && customNumbers.length > 0 && !session.randomSeedEnabled) {
    return customNumbers;
  }

  return generateUniqueNumbers();
}

export function shouldPersist(
  matchCount: number,
  minimumPersistedMatchCount = MIN_PERSISTED_MATCH_COUNT,
): boolean {
  return matchCount >= minimumPersistedMatchCount;
}

export function summarizeMatches(
  tickets: PersistedTicketSnapshot[],
): MatchSummary {
  const summary = createEmptyMatchSummary();

  for (const ticket of tickets) {
    const { matchCount } = calculateMatches(
      ticket.winningNumbers,
      ticket.ticketNumbers,
    );

    incrementMatchSummary(summary, matchCount);
  }

  return summary;
}

export function calculateSimulationStats(
  numberOfTickets: number,
  ticketPrice = LOTTERY_PRIZE,
  weeksPerYear = WEEKS_PER_YEAR,
): SimulationStats {
  return {
    yearsSpent: Math.floor(numberOfTickets / weeksPerYear),
    costOfTickets: numberOfTickets * ticketPrice,
  };
}

export function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is number => typeof item === 'number');
}

function createEmptyMatchSummary(): MatchSummary {
  return {
    twoMatches: 0,
    threeMatches: 0,
    fourMatches: 0,
    fiveMatches: 0,
  };
}

function incrementMatchSummary(summary: MatchSummary, matchCount: number) {
  if (matchCount === 2) summary.twoMatches++;
  if (matchCount === 3) summary.threeMatches++;
  if (matchCount === 4) summary.fourMatches++;
  if (matchCount === 5) summary.fiveMatches++;
}