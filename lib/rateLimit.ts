type RateEntry = { count: number; expiresAt: number };

const rateMap = new Map<string, RateEntry>();

export const checkRateLimit = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const existing = rateMap.get(key);
  if (!existing || existing.expiresAt < now) {
    rateMap.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }
  if (existing.count >= limit) {
    return false;
  }
  existing.count += 1;
  rateMap.set(key, existing);
  return true;
};
