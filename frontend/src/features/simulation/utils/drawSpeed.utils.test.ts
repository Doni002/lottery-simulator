import { describe, expect, it } from 'vitest';
import { mapSliderValueToDrawSpeed } from './drawSpeed.utils';

describe('mapSliderValueToDrawSpeed', () => {
  it('maps slider boundaries to backend boundaries', () => {
    expect(mapSliderValueToDrawSpeed(1)).toBe(1000);
    expect(mapSliderValueToDrawSpeed(100)).toBe(10);
  });

  it('clamps values outside slider range', () => {
    expect(mapSliderValueToDrawSpeed(-10)).toBe(1000);
    expect(mapSliderValueToDrawSpeed(500)).toBe(10);
  });

  it('maps midpoint value with inverse relationship', () => {
    expect(mapSliderValueToDrawSpeed(50)).toBe(510);
  });
});
