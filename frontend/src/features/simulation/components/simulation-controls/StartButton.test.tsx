import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { StartButton } from './StartButton';

describe('StartButton', () => {
  it('shows start label by default and triggers click', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<StartButton onClick={onClick} />);

    const button = screen.getByRole('button', { name: 'Start Simulation' });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows stop label while simulation is running', () => {
    render(<StartButton onClick={() => undefined} isRunning />);

    expect(
      screen.getByRole('button', { name: 'Stop Simulation' }),
    ).toBeInTheDocument();
  });
});
