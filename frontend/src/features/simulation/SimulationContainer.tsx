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
  const [isCheckboxBlinking, setIsCheckboxBlinking] = useState(false);
  const [hasSimulationStarted, setHasSimulationStarted] = useState(false);

  const handleToggleRandom = () => {
    if (hasSimulationStarted) return;
    setPlayWithRandomNumbers((prev) => {
      if (!prev) setCustomNumbers(Array(REQUIRED_NUMBERS).fill(undefined));
      return !prev;
    });
  };

  const handleStartSimulation = async (params: Parameters<typeof start>[0]) => {
    setHasSimulationStarted(true);
    return start(params);
  };

  const handleNonEditableYourNumbersClick = () => {
    setIsCheckboxBlinking(true);
    setTimeout(() => setIsCheckboxBlinking(false), 500);
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
          onNonEditableYourNumbersClick={handleNonEditableYourNumbersClick}
        />
        <SimulationForm
          isLoading={isLoading}
          isRunning={isRunning}
          error={error}
          playWithRandomNumbers={playWithRandomNumbers}
          customNumbers={customNumbers.filter((v): v is number => v !== undefined)}
          onToggleRandom={handleToggleRandom}
          onStart={handleStartSimulation}
          onStop={stop}
          onDrawSpeedChange={updateDrawSpeed}
          randomCheckboxIsBlinking={isCheckboxBlinking}
          randomCheckboxDisabled={hasSimulationStarted}
        />
      </Card>
    </div>
  );
}
