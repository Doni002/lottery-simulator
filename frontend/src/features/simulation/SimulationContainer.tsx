import { useState } from 'react';
import { Card, NumbersComparison, ResultDetails, SimulationForm, Summary } from './components';
import { REQUIRED_NUMBERS } from './constants/simulation.constants';
import { useSimulation } from './hooks/useSimulation';

export function SimulationContainer() {
  const { isLoading, isRunning, error, progress, start, stop, updateDrawSpeed } = useSimulation();
  const [playWithRandomNumbers, setPlayWithRandomNumbers] = useState(true);
  const [customNumbers, setCustomNumbers] = useState<(number | undefined)[]>(
    Array(REQUIRED_NUMBERS).fill(undefined),
  );

  const handleToggleRandom = () => {
    setPlayWithRandomNumbers((prev) => {
      if (!prev) setCustomNumbers(Array(REQUIRED_NUMBERS).fill(undefined));
      return !prev;
    });
  };

  return (
    <div className="h-full min-h-full flex items-center justify-center p-4 md:p-6">
      <Card>
        <Summary
          numberOfTickets={progress?.numberOfTickets}
          yearsSpent={progress?.yearsSpent}
          costOfTickets={progress?.costOfTickets}
        />
        <ResultDetails matches={progress?.matches} />
        <NumbersComparison
          winningNumbers={progress?.winningNumbers}
          yourNumbers={isRunning || progress ? progress?.yourNumbers : customNumbers}
          isEditable={!playWithRandomNumbers && !isRunning}
          onYourNumbersChange={setCustomNumbers}
        />
        <SimulationForm
          isLoading={isLoading}
          isRunning={isRunning}
          error={error}
          playWithRandomNumbers={playWithRandomNumbers}
          customNumbers={customNumbers.filter((v): v is number => v !== undefined)}
          onToggleRandom={handleToggleRandom}
          onStart={start}
          onStop={stop}
          onDrawSpeedChange={updateDrawSpeed}
        />
      </Card>
    </div>
  );
}
