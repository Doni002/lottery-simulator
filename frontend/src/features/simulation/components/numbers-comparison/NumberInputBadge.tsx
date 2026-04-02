import { forwardRef } from 'react';
import { MAX_LOTTO_NUM, MIN_LOTTO_NUM } from '../../constants/simulation.constants';

interface NumberInputBadgeProps {
  value: number | undefined;
  isDuplicate?: boolean;
  onChange: (value: number | undefined) => void;
  onEnter?: () => void;
}

export const NumberInputBadge = forwardRef<HTMLInputElement, NumberInputBadgeProps>(
  ({ value, isDuplicate = false, onChange, onEnter }, ref) => {
    const borderClass = isDuplicate
      ? 'border-red-500 focus:border-red-500'
      : 'border-[var(--color-mint)] focus:border-[var(--color-simulation-text)]';

    return (
      <input
        ref={ref}
        type="number"
        min={MIN_LOTTO_NUM}
        max={MAX_LOTTO_NUM}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            onChange(undefined);
            return;
          }
          const n = Math.min(MAX_LOTTO_NUM, Math.max(MIN_LOTTO_NUM, Number(raw)));
          onChange(n);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter?.();
          }
        }}
        className={`flex h-[25px] w-[22px] items-center justify-center rounded-[6px] border bg-white text-center text-[12px] text-[var(--color-simulation-text)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none md:h-[38px] md:w-[34px] md:rounded-[10px] md:text-[16px] ${borderClass}`}
      />
    );
  },
);
