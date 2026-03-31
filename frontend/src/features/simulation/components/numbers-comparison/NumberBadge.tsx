interface NumberBadgeProps {
  value: number;
}

export function NumberBadge({ value }: NumberBadgeProps) {
  return (
    <div className="flex h-[25px] w-[22px] items-center justify-center rounded-[6px] border border-[#A5D9C8] bg-white text-[12px] leading-[100%] text-[var(--color-simulation-text)] md:h-[38px] md:w-[34px] md:rounded-[10px] md:text-[16px]">
      {value}
    </div>
  );
}