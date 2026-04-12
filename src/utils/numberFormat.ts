export const numToSum = (amount?: number, division = 1) =>
  new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(Number(amount) / division);

/** Minglar, millionlar, milliardlar — vergul bilan guruhlangan butun son (masalan: 866169 → 866,169). */
export function formatIntegerCount(value?: number | null): string {
  const n = Number(value);
  if (value == null || Number.isNaN(n)) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
}
