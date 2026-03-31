import { NumberBadge } from './NumberBadge';

interface NumberRowProps {
  label: string;
  numbers: number[];
}

export function NumberRow({ label, numbers }: NumberRowProps) {
  return (
    <div className="flex flex-row items-center gap-3 md:gap-4">
      <span className="min-w-[110px] text-[12px] leading-[100%] text-[#060658] md:min-w-[160px] md:text-[16px]">
        {label}
      </span>

      <div className="flex flex-wrap items-center gap-4">
        {numbers.map((number) => (
          <NumberBadge key={`${label}-${number}`} value={number} />
        ))}
      </div>
    </div>
  );
}