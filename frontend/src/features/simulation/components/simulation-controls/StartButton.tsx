interface StartButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isRunning?: boolean;
  disabled?: boolean;
  label?: string;
}

export function StartButton({
  onClick,
  isLoading = false,
  isRunning = false,
  disabled = false,
  label = 'Start Simulation'
}: StartButtonProps) {
  const getLabel = () => {
    if (isLoading) return 'Simulating...';
    if (isRunning) return 'Stop Simulation';
    return label;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      className="w-full cursor-pointer rounded-[12px] bg-[var(--color-mint)] px-6 py-3 text-[12px] font-semibold leading-[100%] text-white shadow-[var(--shadow-element)] transition-all hover:opacity-90 active:scale-99 disabled:opacity-60 disabled:cursor-not-allowed md:text-[16px]"
    >
      {getLabel()}
    </button>
  );
}
