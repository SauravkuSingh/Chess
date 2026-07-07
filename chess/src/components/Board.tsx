import { Square } from './Square';
import { FILES, RANKS } from '../constants/board';
import { useChessGame } from '../hooks/useChessGame';
import { PromotionPicker } from './PromotionPicker';
import { GameInfo } from './GameInfo';
export function Board() {
  const {board,turn,handleSquareClick,status,selectedSquare,legalTargets,pendingPromotion,completePromotion} = useChessGame()

  return (
    <>
    <GameInfo turn = {turn} status={status} />
    <div className='relative'>

    <div className="grid grid-cols-8 w-[min(90vw,512px)] border-4 border-neutral-700 shadow-2xl">
      {RANKS.map((rank, row) =>
        FILES.map((file, col) => {
          const squareName = `${file}${rank}`;
          const isLight = (row + col) % 2 === 0;
          const piece = board[row][col];   // the piece on this square, or null
          return (
            <Square
              key={squareName}
              square={squareName}
              isLight={isLight}
              isSelected={squareName === selectedSquare}
              rankLabel={col === 0 ? rank : undefined}
              fileLabel={row === 7 ? file : undefined}
              piece={piece}
              onSelect={handleSquareClick}
              isLegalMove={legalTargets.includes(squareName)}
            />
          );
        })
      )}
    </div>

    {pendingPromotion &&(
      <PromotionPicker color={turn} onChoose={completePromotion}/>
    )}

    </div>
    </>
    
  );
}

