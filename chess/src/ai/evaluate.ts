import type { Chess, PieceSymbol } from 'chess.js';

// Standard relative piece values (in "pawns").
const PIECE_VALUE: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

// Score from WHITE's perspective: positive = good for White, negative = good for Black.
export function evaluate(game: Chess): number {
  let score = 0;
  for (const row of game.board()) {
    for (const cell of row) {
      if (!cell) continue;
      const value = PIECE_VALUE[cell.type];
      score += cell.color === 'w' ? value : -value;
    }
  }
  return score;
}
