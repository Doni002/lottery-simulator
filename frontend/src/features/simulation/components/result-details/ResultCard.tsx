import { memo } from 'react';
import { formatNumber } from '../../../../shared/utils/formatNumber';

interface ResultCardProps {
  matchCount: number;
  value: number;
}

export const ResultCard = memo(function ResultCard({ matchCount, value }: ResultCardProps) {
  return (
    <div className="flex h-[72px] w-full flex-col items-center justify-center gap-2 bg-white md:w-[127px]">
      <span className="text-center text-[12px] font-bold text-[#060658]">
        {matchCount} matches
      </span>
      <span className="text-[16px] font-bold text-[#060658]">
        {formatNumber(value)}
      </span>
    </div>
  );
});