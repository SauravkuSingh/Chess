import type { PieceSymbol } from 'chess.js';

// Filled glyph per piece type. Color is applied via CSS in <Piece />.
export const PIECE_GLYPH: Record<PieceSymbol, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};
