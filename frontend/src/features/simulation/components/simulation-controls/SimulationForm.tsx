import { useState } from 'react';
import { RandomNumbersToggle } from './RandomNumbersToggle';
import { Slider } from './Slider';
import { StartButton } from './StartButton';

export function SimulationForm() {
  const [playWithRandomNumbers, setPlayWithRandomNumbers] = useState(true);
  const [drawSpeed, setDrawSpeed] = useState(68);
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleStartSimulation = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      console.log('Starting simulation with:', { playWithRandomNumbers, drawSpeed });
      // const response = await simulateSession({ playWithRandomNumbers, drawSpeed });
      // When backend confirms, set isRunning to true
      setIsRunning(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopSimulation = () => {
    console.log('Stopping simulation');
    // TODO: Wire to stop simulation API
    setIsRunning(false);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <RandomNumbersToggle
        checked={playWithRandomNumbers}
        onToggle={() => setPlayWithRandomNumbers((prev) => !prev)}
      />

      <Slider value={drawSpeed} onChange={setDrawSpeed} />

      <StartButton
        onClick={isRunning ? handleStopSimulation : handleStartSimulation}
        isLoading={isLoading}
        isRunning={isRunning}
      />
    </div>
  );
}