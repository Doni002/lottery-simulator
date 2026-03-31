import { ResultCard } from '../../../shared/components/ResultCard';

const MATCH_RESULTS = [
  { matchCount: 2, value: 0 },
  { matchCount: 3, value: 0 },
  { matchCount: 4, value: 0 },
  { matchCount: 5, value: 0 }
];

export function ResultDetails() {
  return (
    <div className="w-full max-w-[325px] min-w-[288px] md:w-fit md:max-w-none md:min-w-0 overflow-hidden rounded-[20px] border border-[#E8E2B4] shadow-[1px_1px_6px_0px_#00000026]">
      <div className="grid grid-cols-2 md:grid-cols-[repeat(4,127px)] divide-x divide-y md:divide-y-0 divide-[#E8E2B4]">
        {MATCH_RESULTS.map(({ matchCount, value }) => (
          <ResultCard key={matchCount} matchCount={matchCount} value={value} />
        ))}
      </div>
    </div>
  );
}
