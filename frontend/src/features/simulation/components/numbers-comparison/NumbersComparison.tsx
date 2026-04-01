import { NumberRow } from './NumberRow';

interface NumbersComparisonProps {
  winningNumbers?: number[];
  yourNumbers?: (number | undefined)[];
  isEditable?: boolean;
  onYourNumbersChange?: (numbers: (number | undefined)[]) => void;
  onNonEditableYourNumbersClick?: () => void;
}

export function NumbersComparison({
  winningNumbers = [],
  yourNumbers = [],
  isEditable = false,
  onYourNumbersChange,
  onNonEditableYourNumbersClick,
}: NumbersComparisonProps) {
  return (
    <div className="flex w-full flex-col gap-8">
      <NumberRow label="Winning numbers:" numbers={winningNumbers} />
      <NumberRow
        label="Your numbers:"
        numbers={yourNumbers}
        editable={isEditable}
        onChange={onYourNumbersChange}
        onNonEditableClick={onNonEditableYourNumbersClick}
      />
    </div>
  );
}