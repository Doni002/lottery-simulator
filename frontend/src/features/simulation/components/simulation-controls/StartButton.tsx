interface StartButtonProps {
  onClick: () => void;
  isRunning?: boolean;
  disabled?: boolean;
  label?: string;
}

export function StartButton({
  onClick,
  isRunning = false,
  disabled = false,
  label = 'Start Simulation'
}: StartButtonProps) {
  const getLabel = () => {
    if (isRunning) return 'Stop Simulation';
    return label;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full cursor-pointer rounded-[12px] bg-[var(--color-mint)] px-6 py-3 text-[12px] font-semibold text-white shadow-[var(--shadow-element)] disabled:opacity-60 disabled:cursor-not-allowed md:text-[16px]"
    >
      {getLabel()}
    </button>
  );
}
