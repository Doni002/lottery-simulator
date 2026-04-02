import { randomInt } from 'node:crypto';
import {
  MAX_LOTTO_NUM,
  REQUIRED_NUMBERS,
} from '../constants/simulation.constants';

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
    const randomIndex = randomInt(pool.length);
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

export function toNumberArray(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is number => typeof item === 'number');
}
