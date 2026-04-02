import { summarizePersistedMatches } from './match-summary.utils';

describe('match-summary.utils', () => {
  it('counts persisted tickets by match bucket (2..5)', () => {
    const summary = summarizePersistedMatches([
      { winningNumbers: [1, 2, 3, 4, 5], ticketNumbers: [1, 2, 9, 10, 11] },
      { winningNumbers: [1, 2, 3, 4, 5], ticketNumbers: [1, 2, 3, 12, 13] },
      { winningNumbers: [1, 2, 3, 4, 5], ticketNumbers: [1, 2, 3, 4, 14] },
      { winningNumbers: [1, 2, 3, 4, 5], ticketNumbers: [1, 2, 3, 4, 5] },
      { winningNumbers: [1, 2, 3, 4, 5], ticketNumbers: [20, 21, 22, 23, 24] },
    ]);

    expect(summary).toEqual({
      twoMatches: 1,
      threeMatches: 1,
      fourMatches: 1,
      fiveMatches: 1,
    });
  });

  it('returns empty summary for no tickets', () => {
    expect(summarizePersistedMatches([])).toEqual({
      twoMatches: 0,
      threeMatches: 0,
      fourMatches: 0,
      fiveMatches: 0,
    });
  });
});
