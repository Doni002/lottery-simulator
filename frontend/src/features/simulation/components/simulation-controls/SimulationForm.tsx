import { memo, useState } from 'react';
import type { StartSimulationParams } from '../../hooks/useSimulation';
import { REQUIRED_NUMBERS } from '../../constants/simulation.constants';
import { mapSliderValueToDrawSpeed } from '../../utils/drawSpeed.utils';
import { RandomNumbersToggle } from './RandomNumbersToggle';
import { Slider } from './Slider';
import { StartButton } from './StartButton';

interface SimulationFormProps {
  isRunning: boolean;
  error: string | null;
  playWithRandomNumbers: boolean;
  customNumbers: number[];
  onToggleRandom: () => void;
  onStart: (params: StartSimulationParams) => Promise<boolean>;
  onStop: () => Promise<boolean>;
  onDrawSpeedChange?: (drawSpeed: number) => void;
  randomCheckboxIsBlinking?: boolean;
  randomCheckboxDisabled?: boolean;
}

export const SimulationForm = memo(function SimulationForm({
  isRunning,
  error,
  playWithRandomNumbers,
  customNumbers,
  onToggleRandom,
  onStart,
  onStop,
  onDrawSpeedChange,
  randomCheckboxIsBlinking = false,
  randomCheckboxDisabled = false,
}: SimulationFormProps) {
  const [drawSpeed, setDrawSpeed] = useState(68);

  const isStartDisabled =
    !playWithRandomNumbers &&
    !isRunning &&
    (customNumbers.length < REQUIRED_NUMBERS ||
      new Set(customNumbers).size < customNumbers.length);

  const handleStartSimulation = async () => {
    const backendDrawSpeed = mapSliderValueToDrawSpeed(drawSpeed);

    await onStart({
      drawSpeed: backendDrawSpeed,
      randomSeedEnabled: playWithRandomNumbers,
      customNumbers: playWithRandomNumbers ? undefined : customNumbers,
    });
  };

  const handleStopSimulation = async () => {
    await onStop();
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <RandomNumbersToggle
        checked={playWithRandomNumbers}
        onToggle={onToggleRandom}
        isBlinking={randomCheckboxIsBlinking}
        disabled={randomCheckboxDisabled}
      />

      <Slider
        value={drawSpeed}
        onChange={setDrawSpeed}
        onChangeEnd={(sliderValue) => {
          if (isRunning) {
            onDrawSpeedChange?.(mapSliderValueToDrawSpeed(sliderValue));
          }
        }}
      />

      <StartButton
        onClick={isRunning ? handleStopSimulation : handleStartSimulation}
        isRunning={isRunning}
        disabled={isStartDisabled}
      />

      {error ? (
        <p className="text-[12px] text-red-600 md:text-[14px]">{error}</p>
      ) : null}
    </div>
  );
});