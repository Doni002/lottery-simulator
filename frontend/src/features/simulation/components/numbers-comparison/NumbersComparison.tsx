import { NumberRow } from './NumberRow';

const WINNING_NUMBERS = [1, 9, 34, 68, 90];
const USER_NUMBERS = [2, 7, 32, 44, 87];

export function NumbersComparison() {
  return (
    <div className="flex w-full flex-col gap-8">
      <NumberRow label="Winning numbers:" numbers={WINNING_NUMBERS} />
      <NumberRow label="Your numbers:" numbers={USER_NUMBERS} />
    </div>
  );
}