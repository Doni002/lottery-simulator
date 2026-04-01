import { NumberRow } from './NumberRow';

interface NumbersComparisonProps {
  winningNumbers?: number[];
  yourNumbers?: (number | undefined)[];
  isEditable?: boolean;
  onYourNumbersChange?: (numbers: (number | undefined)[]) => void;
}

export function NumbersComparison({
  winningNumbers = [],
  yourNumbers = [],
  isEditable = false,
  onYourNumbersChange,
}: NumbersComparisonProps) {
  return (
    <div className="flex w-full flex-col gap-8">
      <NumberRow label="Winning numbers:" numbers={winningNumbers} />
      <NumberRow
        label="Your numbers:"
        numbers={yourNumbers}
        editable={isEditable}
        onChange={onYourNumbersChange}
      />
    </div>
  );
}