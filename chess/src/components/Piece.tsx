import type { Color, PieceSymbol } from 'chess.js';
import { PIECE_GLYPH } from '../constants/pieces';

type PieceProps = {
  type: PieceSymbol;
  color: Color;
};

export function Piece({ type, color }: PieceProps) {
  const isWhite = color === 'w';
  return (
    <span
      className="select-none text-4xl sm:text-5xl leading-none"
      style={{
        color: isWhite ? '#ffffff' : '#111111',
        WebkitTextStroke: isWhite ? '1.5px #111' : '1px #000',
      }}
    >
      {PIECE_GLYPH[type]}
    </span>
  );
}
