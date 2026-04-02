import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SimulationContainer } from './SimulationContainer';

const useSimulationMock = vi.fn();

vi.mock('./hooks/useSimulation', () => ({
  useSimulation: () => useSimulationMock(),
}));

vi.mock('./components', () => ({
  Card: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Summary: () => <div>summary</div>,
  ResultDetails: () => <div>results</div>,
  NumbersComparison: () => <div>numbers</div>,
  SimulationForm: ({
    onStart,
    onToggleRandom,
    randomCheckboxDisabled,
  }: {
    onStart: (params: { drawSpeed: number; randomSeedEnabled: boolean }) => Promise<boolean>;
    onToggleRandom: () => void;
    randomCheckboxDisabled?: boolean;
  }) => (
    <div>
      <button
        type="button"
        onClick={() => onStart({ drawSpeed: 750, randomSeedEnabled: true })}
      >
        trigger-start
      </button>
      <button
        type="button"
        onClick={onToggleRandom}
        disabled={randomCheckboxDisabled}
      >
        trigger-toggle
      </button>
      <span data-testid="checkbox-disabled">{String(randomCheckboxDisabled)}</span>
    </div>
  ),
}));

describe('SimulationContainer', () => {
  it('locks random checkbox after a successful start', async () => {
    const user = userEvent.setup();
    const startMock = vi.fn().mockResolvedValue(true);

    useSimulationMock.mockReturnValue({
      isLoading: false,
      isRunning: false,
      error: null,
      progress: null,
      start: startMock,
      stop: vi.fn(),
      updateDrawSpeed: vi.fn(),
    });

    render(<SimulationContainer />);

    expect(screen.getByTestId('checkbox-disabled')).toHaveTextContent('false');

    await user.click(screen.getByRole('button', { name: 'trigger-start' }));

    await waitFor(() => {
      expect(screen.getByTestId('checkbox-disabled')).toHaveTextContent('true');
    });
    expect(screen.getByRole('button', { name: 'trigger-toggle' })).toBeDisabled();
  });

  it('does not lock random checkbox when start is rejected', async () => {
    const user = userEvent.setup();
    const startMock = vi.fn().mockResolvedValue(false);

    useSimulationMock.mockReturnValue({
      isLoading: false,
      isRunning: false,
      error: null,
      progress: null,
      start: startMock,
      stop: vi.fn(),
      updateDrawSpeed: vi.fn(),
    });

    render(<SimulationContainer />);

    await user.click(screen.getByRole('button', { name: 'trigger-start' }));

    await waitFor(() => {
      expect(startMock).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByTestId('checkbox-disabled')).toHaveTextContent('false');
    expect(screen.getByRole('button', { name: 'trigger-toggle' })).not.toBeDisabled();
  });
});
