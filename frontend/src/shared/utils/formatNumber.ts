export function formatNumber(value: number): string {
  return new Intl.NumberFormat('hu-HU').format(value);
}

export function formatCurrency(value: number, currency = 'HUF'): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}
