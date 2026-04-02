import { memo } from 'react';
import { formatNumber } from '../utils/numberFormat.utils';

interface SummaryProps {
  numberOfTickets?: number;
  yearsSpent?: number;
  costOfTickets?: number;
  highlightFiveMatchHit?: boolean;
}

export const Summary = memo(function Summary({
  numberOfTickets = 0,
  yearsSpent = 0,
  costOfTickets = 0,
  highlightFiveMatchHit = false,
}: SummaryProps) {
  const yearsHighlightClasses = highlightFiveMatchHit
    ? 'font-bold text-[#060658]'
    : '';

  return (
    <div className="h-[103px] w-full max-w-[325px] min-w-[288px] rounded-[10px] bg-[var(--color-mint)] p-4 opacity-100 flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between text-[16px] text-white">
        <span>Number of tickets:</span>
        <span>{formatNumber(numberOfTickets)}</span>
      </div>

      <div className="flex items-center justify-between text-[14px] text-white">
        <span className={yearsHighlightClasses}>Years spent:</span>
        <span className={yearsHighlightClasses}>{formatNumber(yearsSpent)}</span>
      </div>

      <div className="flex items-center justify-between text-[14px] text-white">
        <span>Cost of tickets:</span>
        <span>{formatNumber(costOfTickets)}</span>
      </div>
    </div>
  );
});
