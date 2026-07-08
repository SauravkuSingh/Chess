import type { Stats } from '../lib/stats';

type LeaderboardProps = {
  stats: Stats;
  onReset: () => void;
};

export function Leaderboard({ stats, onReset }: LeaderboardProps) {
  const total = stats.wins + stats.losses + stats.draws;
  const winRate = total ? Math.round((stats.wins / total) * 100) : 0;

  return (
    <div className="w-full max-w-[min(90vw,512px)] rounded bg-neutral-800 p-3 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-wide text-neutral-400">Your record vs AI</h2>
        <button onClick={onReset} className="text-xs text-neutral-500 hover:text-neutral-300">
          reset
        </button>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <span className="text-emerald-400">Wins: {stats.wins}</span>
        <span className="text-red-400">Losses: {stats.losses}</span>
        <span className="text-neutral-300">Draws: {stats.draws}</span>
        <span className="ml-auto text-neutral-400">{total} games · {winRate}% win</span>
      </div>
    </div>
  );
}
