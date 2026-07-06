import { Square } from './Square';
import { FILES, RANKS } from '../constants/board';
import { Chess } from 'chess.js';
export function Board() {
  const game = new Chess();
  const board = game.board();          // 8×8 array, same order as your loop

  return (
    <div className="grid grid-cols-8 w-[min(90vw,512px)] border-4 border-neutral-700 shadow-2xl">
      {RANKS.map((rank, row) =>
        FILES.map((file, col) => {
          const squareName = `${file}${rank}`;
          const isLight = (row + col) % 2 === 0;
          const piece = board[row][col];   // the piece on this square, or null
          return (
            <Square
              key={squareName}
              isLight={isLight}
              rankLabel={col === 0 ? rank : undefined}
              fileLabel={row === 7 ? file : undefined}
              piece={piece}
            />
          );
        })
      )}
    </div>
  );
}

