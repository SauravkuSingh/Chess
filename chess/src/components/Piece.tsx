import type { Color, PieceSymbol } from 'chess.js';
import { pieceImage } from '../constants/pieces';

type PieceProps = {
  type: PieceSymbol;
  color: Color;
};

export function Piece({ type, color }: PieceProps) {
  return (
    <img
      src={pieceImage(color, type)}
      alt={`${color}${type}`}
      draggable={false}
      className="pointer-events-none h-[85%] w-[85%] select-none object-contain"
    />
  );
}
