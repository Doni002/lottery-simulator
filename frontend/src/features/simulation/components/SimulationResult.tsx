import { StatBox } from './StatBox';
import { MatchStats } from './MatchStats';
import { NumberRow } from './NumberRow';

export function SimulationResult() {
  return (
    <div>
      <div>SimulationResult</div>
      <StatBox />
      <MatchStats />
      <NumberRow />
    </div>
  );
}
