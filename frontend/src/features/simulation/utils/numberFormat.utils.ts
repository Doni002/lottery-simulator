export function formatNumber(value: number): string {
  return new Intl.NumberFormat('hu-HU').format(value);
}