interface RandomNumbersToggleProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
}

export function RandomNumbersToggle({
  checked,
  onToggle,
  label = 'Play with random numbers:'
}: RandomNumbersToggleProps) {
  return (
    <div className="flex items-center gap-10 md:gap-20">
      <span className="text-[12px] leading-[100%] text-[var(--color-simulation-text)] md:text-[16px]">
        {label}
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        aria-label={label}
        className="flex h-[20px] w-[20px] items-center justify-center rounded-[6px] border-1 border-[var(--color-simulation-text)] bg-white shadow-[1px_1px_6px_0px_#00000026] md:h-[32px] md:w-[32px] md:rounded-[10px]"
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