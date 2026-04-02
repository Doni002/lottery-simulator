interface NumberBadgeProps {
  value?: number;
  onClick?: () => void;
}

export function NumberBadge({ value, onClick }: NumberBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[25px] w-[22px] items-center justify-center rounded-[6px] border border-[var(--color-mint)] bg-white text-[12px] text-[var(--color-simulation-text)] cursor-pointer md:h-[38px] md:w-[34px] md:rounded-[10px] md:text-[16px]"
    >
      {value ?? ''}
    </button>
  );
}