import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RandomNumbersToggle } from './RandomNumbersToggle';

describe('RandomNumbersToggle', () => {
  it('calls onToggle when enabled', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<RandomNumbersToggle checked onToggle={onToggle} />);

    const button = screen.getByRole('button', {
      name: 'Play with random numbers:',
    });

    await user.click(button);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('is not clickable when disabled', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(<RandomNumbersToggle checked onToggle={onToggle} disabled />);

    const button = screen.getByRole('button', {
      name: 'Play with random numbers:',
    });

    expect(button).toBeDisabled();
    await user.click(button);

    expect(onToggle).not.toHaveBeenCalled();
  });

  it('shows red blink style when isBlinking is true', () => {
    render(<RandomNumbersToggle checked onToggle={() => undefined} isBlinking />);

    const button = screen.getByRole('button', {
      name: 'Play with random numbers:',
    });

    expect(button.className).toContain('border-red-500');
  });
});
