import {
  calculateMatches,
  generateUniqueNumbers,
  toNumberArray,
} from './simulation-number.utils';

describe('simulation-number.utils', () => {
  describe('generateUniqueNumbers', () => {
    it('returns unique numbers in valid range', () => {
      const result = generateUniqueNumbers(5, 90);

      expect(result).toHaveLength(5);
      expect(new Set(result).size).toBe(5);
      expect(result.every((n) => n >= 1 && n <= 90)).toBe(true);
    });

    it('throws when count is invalid', () => {
      expect(() => generateUniqueNumbers(0, 90)).toThrow(
        'count must be between 1 and maxNumber',
      );
      expect(() => generateUniqueNumbers(91, 90)).toThrow(
        'count must be between 1 and maxNumber',
      );
    });
  });

  describe('calculateMatches', () => {
    it('returns sorted matching numbers and match count', () => {
      const result = calculateMatches([10, 20, 30, 40, 50], [50, 7, 10, 99, 20]);

      expect(result).toEqual({
        matchCount: 3,
        matchingNumbers: [10, 20, 50],
      });
    });

    it('returns zero for no matches', () => {
      const result = calculateMatches([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]);

      expect(result).toEqual({
        matchCount: 0,
        matchingNumbers: [],
      });
    });
  });

  describe('toNumberArray', () => {
    it('keeps only numeric values from arrays', () => {
      const result = toNumberArray([1, '2', null, 3, {}, 4]);
      expect(result).toEqual([1, 3, 4]);
    });

    it('returns empty array for non-arrays', () => {
      expect(toNumberArray('not-array')).toEqual([]);
      expect(toNumberArray(null)).toEqual([]);
      expect(toNumberArray({})).toEqual([]);
    });
  });
});
