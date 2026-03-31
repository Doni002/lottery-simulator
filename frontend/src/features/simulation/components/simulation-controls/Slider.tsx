import { type ChangeEvent } from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export function Slider({
  value,
  onChange,
  min = 1,
  max = 100,
  label = 'Speed'
}: SliderProps) {
  const range = max - min;
  const normalized = range > 0 ? Math.max(0, Math.min(100, ((value - min) / range) * 100)) : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div className="flex flex-col gap-6">
      <span className="text-[12px] leading-[100%] text-[var(--color-simulation-text)] md:text-[16px]">{label}</span>

      <div className="relative w-full py-2">
        <div className="pointer-events-none absolute left-0 top-1/2 h-[4px] w-full -translate-y-1/2 rounded-full bg-[#E9F5F1]" />
        <div
          style={{ width: `${normalized}%` }}
          className="pointer-events-none absolute left-0 top-1/2 h-[9px] -translate-y-1/2 rounded-full bg-[#A5D9C8] md:h-[10px]"
        />
        <div
          style={{ left: `${normalized}%` }}
          className="pointer-events-none absolute top-1/2 z-20 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-1 ring-[#A5D9C8] md:h-[10px] md:w-[10px] md:ring-2"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          aria-label={label}
          className="relative z-10 h-[16px] w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-[9px] [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-track]:h-[9px] [&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:border-0 md:[&::-webkit-slider-runnable-track]:h-[10px] md:[&::-moz-range-track]:h-[10px]"
        />
      </div>
    </div>
  );
}