import type { Color, PieceSymbol } from 'chess.js';
import { PIECE_GLYPH } from '../constants/pieces';

const CHOICES: PieceSymbol[] = ['q', 'r', 'b', 'n'];



type PromotionPickerProps = {
  color: Color;
  onChoose: (piece: PieceSymbol) => void;
};

export function PromotionPicker({ color, onChoose }: PromotionPickerProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
      <div className="flex gap-2 rounded-lg bg-neutral-800 p-3 shadow-xl">
        {CHOICES.map((piece) => (
          <button
            key={piece}
            onClick={() => onChoose(piece)}
            className="flex h-14 w-14 items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600"
            style={{
              color: color === 'w' ? '#ffffff' : '#111111',
              WebkitTextStroke: color === 'w' ? '1.5px #111' : '1px #000',
              fontSize: '2rem',
            }}
          >
            {PIECE_GLYPH[piece]}
          </button>
        ))}
      </div>
    </div>
  );
}
