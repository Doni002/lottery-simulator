interface StartButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  isRunning?: boolean;
  label?: string;
}

export function StartButton({
  onClick,
  isLoading = false,
  isRunning = false,
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
      disabled={isLoading}
      aria-busy={isLoading}
      className="w-full cursor-pointer rounded-[12px] bg-[#A5D9C8] px-6 py-3 text-[12px] font-semibold leading-[100%] text-white shadow-[1px_1px_6px_0px_#00000026] transition-all hover:opacity-90 active:scale-99 disabled:opacity-60 disabled:cursor-not-allowed md:text-[16px]"
    >
      {getLabel()}
    </button>
  );
}
