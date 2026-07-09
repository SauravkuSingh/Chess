import { useEffect, useRef, useState } from "react";
import { Chess, type Square, type PieceSymbol, type Color } from "chess.js";
import { findBestMove } from '../ai/minimax';
import { loadStats, saveStats, type Stats } from '../lib/stats';


export function useChessGame() {
  const gameRef = useRef(new Chess());
  const game = gameRef.current;
  const INITIAL_TIME = 300;
  const [mode, setMode] = useState<'ai' | 'local'>('ai'); // 'ai' = vs computer, 'local' = 2 players
  const [humanColor, setHumanColor] = useState<Color>('w');
  const [depth, setDepth] = useState(3);
  const [whiteTime, setWhiteTime] = useState(INITIAL_TIME);
  const [blackTime, setBlackTime] = useState(INITIAL_TIME);
  const verboseHistory = game.history({ verbose: true });
  const lastMove = verboseHistory.length ? verboseHistory[verboseHistory.length - 1] : null;


  const flagged = whiteTime <= 0 ? 'w' : blackTime <= 0 ? 'b' : null; // who ran out of time
  const isOver = game.isGameOver() || flagged !== null;        
  const moveHistory = game.history(); // SAN strings, e.g. ['e4', 'e5', 'Nf3']
  const [stats, setStats] = useState<Stats>(() => loadStats());
  const recordedRef = useRef(false);

  const aiColor: Color = humanColor === 'w' ? 'b' : 'w';

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [fen, setFen] = useState(game.fen());
  const isThinking = mode === 'ai' && game.turn() === aiColor && !isOver;

  
  // full verbose moves for the selected piece → drives BOTH the dots and click logic
  const legalMoves = selectedSquare
    ? game.moves({ square: selectedSquare as Square, verbose: true })
    : [];
  const legalTargets: string[] = legalMoves.map((m) => m.to);

  let status: string;
  if(flagged){
    status=`${flagged === 'w'?'Black' : 'White'} wins on time`
  }
  else if (game.isCheckmate()) {
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
  if(mode !=='ai'|| isOver)return;
  const g = gameRef.current;
  if (g.turn() !== aiColor) return;

  const timer = setTimeout(() => {
    const move = findBestMove(g, depth);
    if (!move) return;
    g.move(move);
    setSelectedSquare(null);
    setFen(g.fen());
  }, 400);

  return () => clearTimeout(timer);
  }, [fen, aiColor, depth,mode,isOver]);  
  useEffect(() => {
    if (isOver) return;
    const turn = game.turn();
    const id = setInterval(() => {
      if (turn === 'w') setWhiteTime((t) => Math.max(0, t - 1));
      else setBlackTime((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [fen, isOver]);

  useEffect(() => {
  if (!isOver || mode !== 'ai' || recordedRef.current) return;
  recordedRef.current = true; // lock so we record this game only once

  let result: 'win' | 'loss' | 'draw';
  if (game.isCheckmate()) {
    const winner: Color = game.turn() === 'w' ? 'b' : 'w'; // mated side is game.turn()
    result = winner === humanColor ? 'win' : 'loss';
  } else if (flagged) {
    const winner: Color = flagged === 'w' ? 'b' : 'w';
    result = winner === humanColor ? 'win' : 'loss';
  } else {
    result = 'draw';
  }

  setStats((prev) => {
    const next: Stats = {
      wins: prev.wins + (result === 'win' ? 1 : 0),
      losses: prev.losses + (result === 'loss' ? 1 : 0),
      draws: prev.draws + (result === 'draw' ? 1 : 0),
    };
    saveStats(next); // persist immediately
    return next;
  });
}, [isOver, mode, humanColor, flagged]);

function resetStats() {
  const empty: Stats = { wins: 0, losses: 0, draws: 0 };
  setStats(empty);
  saveStats(empty);
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
    isThinking,
    newGame,
    humanColor,
    chooseSide,
    depth,
    setDepth,
    mode,
    setMode,
    whiteTime,
    blackTime,
    isOver,
    moveHistory,
    stats,
    resetStats,
    lastMove
  };
}
