import { useState } from 'react';
import { RandomNumbersToggle } from './RandomNumbersToggle';
import { Slider } from './Slider';

export function SimulationForm() {
  const [playWithRandomNumbers, setPlayWithRandomNumbers] = useState(true);
  const [drawSpeed, setDrawSpeed] = useState(68);

  return (
    <div className="flex w-full flex-col gap-8">
      <RandomNumbersToggle
        checked={playWithRandomNumbers}
        onToggle={() => setPlayWithRandomNumbers((prev) => !prev)}
      />

      <Slider value={drawSpeed} onChange={setDrawSpeed} />
    </div>
  );
}