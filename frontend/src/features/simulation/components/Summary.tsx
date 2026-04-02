import { memo } from 'react';
import { formatCurrency, formatNumber } from '../../../shared/utils/formatNumber';

interface SummaryProps {
  numberOfTickets?: number;
  yearsSpent?: number;
  costOfTickets?: number;
}

export const Summary = memo(function Summary({
  numberOfTickets = 0,
  yearsSpent = 0,
  costOfTickets = 0,
}: SummaryProps) {
  return (
    <div className="h-[103px] w-full max-w-[325px] min-w-[288px] rounded-[10px] bg-[var(--color-mint)] p-4 opacity-100 flex flex-col justify-center gap-2">
      <div className="flex items-center justify-between text-[16px] text-white">
        <span>Number of tickets:</span>
        <span>{formatNumber(numberOfTickets)}</span>
      </div>

      <div className="flex items-center justify-between text-[14px] text-white">
        <span>Years spent:</span>
        <span>{formatNumber(yearsSpent)}</span>
      </div>

      <div className="flex items-center justify-between text-[14px] text-white">
        <span>Cost of tickets:</span>
        <span>{formatCurrency(costOfTickets, 'HUF')}</span>
      </div>
    </div>
  );
});
