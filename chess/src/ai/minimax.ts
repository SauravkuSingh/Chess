import { Chess } from 'chess.js';
import { evaluate } from './evaluate';

const CHECKMATE = 100000;
function minimax(game: Chess, depth: number, alpha: number, beta: number): number {
  if (game.isGameOver()) {
    if (game.isCheckmate()) {
    
      return game.turn() === 'w' ? -CHECKMATE : CHECKMATE;
    }
    return 0;
  }
  if (depth === 0) return evaluate(game);

  const moves = game.moves();

  if (game.turn() === 'w') {         
    let best = -Infinity;
    for (const move of moves) {
      game.move(move);
      best = Math.max(best, minimax(game, depth - 1, alpha, beta));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;     
    }
    return best;
  } else {                           
    let best = Infinity;
    for (const move of moves) {
      game.move(move);
      best = Math.min(best, minimax(game, depth - 1, alpha, beta));
      game.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;      
    }
    return best;
  }
}
export function findBestMove(game: Chess, depth: number): string | null {
  const search = new Chess(game.fen());  
  const moves = search.moves();
  if (moves.length === 0) return null;

  const whiteToMove = search.turn() === 'w';
  let bestMove = moves[0];
  let bestScore = whiteToMove ? -Infinity : Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of moves) {
    search.move(move);
    const score = minimax(search, depth - 1, alpha, beta);
    search.undo();

    if (whiteToMove ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (whiteToMove) alpha = Math.max(alpha, bestScore);
    else beta = Math.min(beta, bestScore);
  }
  return bestMove;
}
