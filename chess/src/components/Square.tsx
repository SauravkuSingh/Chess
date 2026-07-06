import type { Color, PieceSymbol } from 'chess.js';
import { Piece } from './Piece';

type SquareProps = {
  isLight: boolean;
  fileLabel?: string;
  rankLabel?: number;
  piece: { type: PieceSymbol; color: Color } | null;
};

export function Square({ isLight, fileLabel, rankLabel, piece }: SquareProps) {
  const labelColor = isLight ? 'text-[#b58863]' : 'text-[#f0d9b5]';

  return (
    <div
      className={`relative aspect-square flex items-center justify-center ${
        isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'
      }`}
    >
      {rankLabel && (
        <span className={`absolute top-0.5 left-1 text-xs font-semibold ${labelColor}`}>
          {rankLabel}
        </span>
      )}
      {fileLabel && (
        <span className={`absolute bottom-0.5 right-1 text-xs font-semibold ${labelColor}`}>
          {fileLabel}
        </span>
      )}
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
}
