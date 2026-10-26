// Daily token picture for the honors graph.
// Each tool gets a stable number for that UTC day, then the days add up.
// Same date always draws the same chart. The window rolls forward by itself.

export const TOKEN_MIN = 20_000_000;
export const TOKEN_MAX = 50_000_000;
export const TOKEN_DAYS = 7;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type TokenDay = {
  iso: string;
  label: string;
  byModel: Record<string, number>;
  total: number;
};

function hashString(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unit(seedKey: string) {
  let seed = hashString(seedKey) || 1;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function tokensFor(modelKey: string, iso: string) {
  const span = TOKEN_MAX - TOKEN_MIN;
  return TOKEN_MIN + Math.floor(unit(`${modelKey}|${iso}`) * (span + 1));
}

export function formatTokens(value: number) {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `${billions >= 10 ? Math.round(billions) : billions.toFixed(1)}B`;
  }
  return `${Math.round(value / 1_000_000)}M`;
}

export function buildTokenWeek(modelKeys: string[], now = new Date()): TokenDay[] {
  const days: TokenDay[] = [];
  for (let ago = TOKEN_DAYS; ago >= 1; ago--) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - ago));
    const iso = date.toISOString().slice(0, 10);
    const byModel: Record<string, number> = {};
    let total = 0;
    for (const key of modelKeys) {
      const value = tokensFor(key, iso);
      byModel[key] = value;
      total += value;
    }
    days.push({
      iso,
      label: `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`,
      byModel,
      total,
    });
  }
  return days;
}
