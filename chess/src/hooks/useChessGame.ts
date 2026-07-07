import { useEffect, useRef, useState } from "react";
import { Chess, type Square, type PieceSymbol, type Color } from "chess.js";
import { findBestMove } from '../ai/minimax';


export function useChessGame() {
  const gameRef = useRef(new Chess());
  const game = gameRef.current;
  const [mode, setMode] = useState<'ai' | 'local'>('ai'); // 'ai' = vs computer, 'local' = 2 players
  const [humanColor, setHumanColor] = useState<Color>('w');
  const [depth, setDepth] = useState(3);
  const aiColor: Color = humanColor === 'w' ? 'b' : 'w';

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [fen, setFen] = useState(game.fen());
  const isThinking =mode === 'ai'&& game.turn() === aiColor && !game.isGameOver();
  
  // full verbose moves for the selected piece → drives BOTH the dots and click logic
  const legalMoves = selectedSquare
    ? game.moves({ square: selectedSquare as Square, verbose: true })
    : [];
  const legalTargets: string[] = legalMoves.map((m) => m.to);

  let status: string;
  if (game.isCheckmate()) {
    status = `Checkmate — ${game.turn() === "w" ? "Black" : "White"} wins`;
  } else if (game.isStalemate()) {
    status = "Draw — stalemate";
  } else if (game.isDraw()) {
    status = "Draw";
  } else if (game.isCheck()) {
    status = `${game.turn() === "w" ? "White" : "Black"} to move — check!`;
  } else {
    status = `${game.turn() === "w" ? "White" : "Black"} to move`;
  }
function newGame() {
  game.reset();                 // back to the starting position
  setSelectedSquare(null);
  setPendingPromotion(null);
  setFen(game.fen());
}
  function handleSquareClick(square: string) {
    if (mode === 'ai' &&game.turn() === aiColor) return;
    if (selectedSquare) {
      const move = legalMoves.find((m) => m.to === square);
      if (move) {
        if (move.flags.includes("p")) {
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
  function chooseSide(color: Color) {
  setHumanColor(color);
  game.reset();               // switching sides mid-game is incoherent → fresh start
  setSelectedSquare(null);
  setPendingPromotion(null);
  setFen(game.fen());
}

 useEffect(() => {
  if(mode !=='ai')return;
  const g = gameRef.current;
  if (g.turn() !== aiColor || g.isGameOver()) return;

  const timer = setTimeout(() => {
    const move = findBestMove(g, depth);
    if (!move) return;
    g.move(move);
    setSelectedSquare(null);
    setFen(g.fen());
  }, 400);

  return () => clearTimeout(timer);
}, [fen, aiColor, depth,mode]);  


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
    isThinking,
    newGame,
    humanColor,
    chooseSide,
    depth,
    setDepth,
    mode,
    setMode
  };
}
