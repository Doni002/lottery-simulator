import {
  DRAW_SPEED_MAX,
  DRAW_SPEED_MIN,
  DRAW_SPEED_SLIDER_MAX,
  DRAW_SPEED_SLIDER_MIN,
} from '../constants/simulation.constants';

export function mapSliderValueToDrawSpeed(sliderValue: number): number {
  const ratio = (sliderValue - DRAW_SPEED_SLIDER_MIN) /
    (DRAW_SPEED_SLIDER_MAX - DRAW_SPEED_SLIDER_MIN);
  const clampedRatio = Math.max(0, Math.min(1, ratio));

  return Math.round(
    DRAW_SPEED_MAX - (DRAW_SPEED_MAX - DRAW_SPEED_MIN) * clampedRatio,
  );
}
