import type { Color, PieceSymbol } from 'chess.js';

// Images live in /public/pieces (served at /pieces/<code>.png).
// Filenames: color + UPPERCASE type — e.g. wP.png, bN.png.
export function pieceImage(color: Color, type: PieceSymbol): string {
  return `/pieces/${color}${type.toUpperCase()}.png`;
}
