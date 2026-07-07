import type { Color } from 'chess.js';

type GameInfoProps = {
  turn: Color;
  status: string;
};

export function GameInfo({ turn, status }: GameInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`inline-block h-4 w-4 rounded-full border ${
          turn === 'w' ? 'bg-white border-neutral-400' : 'bg-neutral-900 border-neutral-500'
        }`}
      />
      <span className="text-lg font-medium">{status}</span>
    </div>
  );
}
