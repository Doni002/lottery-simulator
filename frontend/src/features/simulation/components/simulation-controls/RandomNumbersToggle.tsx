import { useId } from 'react';

interface RandomNumbersToggleProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  isBlinking?: boolean;
  disabled?: boolean;
}

export function RandomNumbersToggle({
  checked,
  onToggle,
  label = 'Play with random numbers:',
  isBlinking = false,
  disabled = false
}: RandomNumbersToggleProps) {
  const labelId = useId();

  return (
    <div className="flex items-center gap-10 md:gap-20">
      <span id={labelId} className="text-[12px] text-[var(--color-simulation-text)] md:text-[16px]">
        {label}
      </span>

      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={checked}
        aria-labelledby={labelId}
        className={`flex h-[20px] w-[20px] items-center justify-center rounded-[6px] border-1 bg-white shadow-[var(--shadow-element)] md:h-[32px] md:w-[32px] md:rounded-[10px] ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-[var(--color-simulation-text)]'
            : isBlinking
              ? 'animate-pulse border-red-500'
              : 'border-[var(--color-simulation-text)]'
        }`}
      >
        {checked ? (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="md:h-[18px] md:w-[18px]"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="var(--color-simulation-text)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </button>
    </div>
  );
}