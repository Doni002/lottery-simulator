import { useRef } from 'react';
import { REQUIRED_NUMBERS } from '../../constants/simulation.constants';
import { NumberBadge } from './NumberBadge';
import { NumberInputBadge } from './NumberInputBadge';

interface NumberRowProps {
  label: string;
  numbers: (number | undefined)[];
  editable?: boolean;
  onChange?: (numbers: (number | undefined)[]) => void;
}

export function NumberRow({ label, numbers, editable = false, onChange }: NumberRowProps) {
  const slots: (number | undefined)[] = Array.from({ length: REQUIRED_NUMBERS }, (_, i) => numbers[i]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const duplicateIndices = new Set(
    slots.flatMap((v, i) =>
      v !== undefined && slots.some((other, j) => j !== i && other === v) ? [i] : [],
    ),
  );

  const handleChange = (index: number, value: number | undefined) => {
    const updated: (number | undefined)[] = [...slots];
    updated[index] = value;
    onChange?.(updated);
  };

  const focusNext = (index: number) => {
    inputRefs.current[index + 1]?.focus();
  };

  return (
    <div className="flex flex-row items-center gap-3 md:gap-4">
      <span className="min-w-[110px] text-[12px] leading-[100%] text-[var(--color-simulation-text)] md:min-w-[160px] md:text-[16px]">
        {label}
      </span>

      <div className="flex flex-wrap items-center gap-4">
        {slots.map((number, i) =>
          editable ? (
            <NumberInputBadge
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              value={number}
              isDuplicate={duplicateIndices.has(i)}
              onChange={(v) => handleChange(i, v)}
              onEnter={() => focusNext(i)}
            />
          ) : (
            <NumberBadge key={i} value={number} />
          ),
        )}
      </div>
    </div>
  );
}