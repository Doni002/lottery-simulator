import { useState } from 'react';
import type { StartSimulationParams } from '../../hooks/useSimulation';
import { REQUIRED_NUMBERS } from '../../constants/simulation.constants';
import { RandomNumbersToggle } from './RandomNumbersToggle';
import { Slider } from './Slider';
import { StartButton } from './StartButton';

interface SimulationFormProps {
  isLoading: boolean;
  isRunning: boolean;
  error: string | null;
  playWithRandomNumbers: boolean;
  customNumbers: number[];
  onToggleRandom: () => void;
  onStart: (params: StartSimulationParams) => Promise<boolean>;
  onStop: () => void;
  onDrawSpeedChange?: (drawSpeed: number) => void;
}

function mapSliderValueToDrawSpeed(sliderValue: number): number {
  const minSlider = 1;
  const maxSlider = 100;
  const minBackendSpeed = 10;
  const maxBackendSpeed = 1000;

  const ratio = (sliderValue - minSlider) / (maxSlider - minSlider);
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  return Math.round(
    maxBackendSpeed - (maxBackendSpeed - minBackendSpeed) * clampedRatio,
  );
}

export function SimulationForm({
  isLoading,
  isRunning,
  error,
  playWithRandomNumbers,
  customNumbers,
  onToggleRandom,
  onStart,
  onStop,
  onDrawSpeedChange,
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

  const handleStopSimulation = () => {
    // Stop endpoint is not available yet; this only updates frontend running state.
    onStop();
  };

  return (
    <div className="flex w-full flex-col gap-8">
      <RandomNumbersToggle
        checked={playWithRandomNumbers}
        onToggle={onToggleRandom}
      />

      <Slider
        value={drawSpeed}
        onChange={setDrawSpeed}
        onChangeEnd={(sliderValue) => onDrawSpeedChange?.(mapSliderValueToDrawSpeed(sliderValue))}
      />

      <StartButton
        onClick={isRunning ? handleStopSimulation : handleStartSimulation}
        isLoading={isLoading}
        isRunning={isRunning}
        disabled={isStartDisabled}
      />

      {error ? (
        <p className="text-[12px] leading-[120%] text-red-600 md:text-[14px]">{error}</p>
      ) : null}
    </div>
  );
}