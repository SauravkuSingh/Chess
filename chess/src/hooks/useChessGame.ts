import { useRef, useState } from 'react';
import { Chess, type Square, type PieceSymbol } from 'chess.js';

export function useChessGame() {
  const gameRef = useRef(new Chess());
  const game = gameRef.current;

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] =
    useState<{ from: string; to: string } | null>(null);
  const [fen, setFen] = useState(game.fen());

  // full verbose moves for the selected piece → drives BOTH the dots and click logic
  const legalMoves = selectedSquare
    ? game.moves({ square: selectedSquare as Square, verbose: true })
    : [];
  const legalTargets: string[] = legalMoves.map((m) => m.to);

  let status: string;
  if (game.isCheckmate()) {
    status = `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
  } else if (game.isStalemate()) {
    status = 'Draw — stalemate';
  } else if (game.isDraw()) {
    status = 'Draw';
  } else if (game.isCheck()) {
    status = `${game.turn() === 'w' ? 'White' : 'Black'} to move — check!`;
  } else {
    status = `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
  }

  function handleSquareClick(square: string) {
    if (selectedSquare) {
      const move = legalMoves.find((m) => m.to === square);
      if (move) {
        if (move.flags.includes('p')) {
          setPendingPromotion({ from: selectedSquare, to: square }); // pause & ask
          return;
        }
        game.move({ from: selectedSquare as Square, to: square as Square });
        setSelectedSquare(null);
        setFen(game.fen());
        return;
      }
    }
    const piece = game.get(square as Square);
    if (piece && piece.color === game.turn()) setSelectedSquare(square);
    else setSelectedSquare(null);
  }

  function completePromotion(piece: PieceSymbol) {
    if (!pendingPromotion) return;
    game.move({
      from: pendingPromotion.from as Square,
      to: pendingPromotion.to as Square,
      promotion: piece,
    });
    setPendingPromotion(null);
    setSelectedSquare(null);
    setFen(game.fen());
  }

  return {
    board: game.board(),
    turn: game.turn(),
    status,
    selectedSquare,
    legalTargets,
    handleSquareClick,
    pendingPromotion,
    completePromotion,
    fen,
  };
}
