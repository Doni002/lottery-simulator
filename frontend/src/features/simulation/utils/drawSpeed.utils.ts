export function mapSliderValueToDrawSpeed(sliderValue: number): number {
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
