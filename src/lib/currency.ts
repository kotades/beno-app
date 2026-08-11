export const CURRENCY = 'USD';

export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString()}`;
}
