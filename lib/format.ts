export const toNumber = (value: unknown): number => {
  const parsed = typeof value === 'string' ? Number(value) : (value as number);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2
  }).format(Number.isFinite(value) ? value : 0);
};

export const formatPercent = (value: number): string => {
  const safe = Number.isFinite(value) ? value : 0;
  return `${safe.toFixed(2)}%`;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
