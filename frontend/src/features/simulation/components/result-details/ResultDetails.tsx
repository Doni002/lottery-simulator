import { memo } from 'react';
import { type MatchSummary } from '../../types/simulation.types';
import { ResultCard } from './ResultCard';

interface ResultDetailsProps {
  matches?: MatchSummary;
}

export const ResultDetails = memo(function ResultDetails({
  matches = {
    twoMatches: 0,
    threeMatches: 0,
    fourMatches: 0,
    fiveMatches: 0,
  },
}: ResultDetailsProps) {
  const matchResults = [
    { matchCount: 2, value: matches.twoMatches },
    { matchCount: 3, value: matches.threeMatches },
    { matchCount: 4, value: matches.fourMatches },
    { matchCount: 5, value: matches.fiveMatches },
  ];

  return (
    <div className="w-full max-w-[325px] min-w-[288px] overflow-hidden rounded-[20px] border border-[var(--color-result-border)] shadow-[0px_0px_6px_0px_#00000026] md:w-fit md:max-w-none md:min-w-0">
      <div className="grid grid-cols-2 gap-px bg-[var(--color-result-border)] md:grid-cols-[repeat(4,127px)]">
        {matchResults.map(({ matchCount, value }) => (
          <ResultCard key={matchCount} matchCount={matchCount} value={value} />
        ))}
      </div>
    </div>
  );
});
