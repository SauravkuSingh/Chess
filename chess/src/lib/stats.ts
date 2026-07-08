export type Stats = { wins: number; losses: number; draws: number };

const KEY = 'chess-stats';
const EMPTY: Stats = { wins: 0, losses: 0, draws: 0 };

export function loadStats(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveStats(stats: Stats): void {
  localStorage.setItem(KEY, JSON.stringify(stats));
}
