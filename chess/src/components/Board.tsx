import { Square } from './Square';
import { FILES, RANKS } from '../constants/board';
import { useChessGame } from '../hooks/useChessGame';
import { PromotionPicker } from './PromotionPicker';
import { GameInfo } from './GameInfo';
import { Clock } from './Clock';
import { MoveList } from './MoveList';
import { Leaderboard } from './Leaderboard';
export function Board() {
 const {
  board, turn, status, selectedSquare, legalTargets, handleSquareClick,
  pendingPromotion, completePromotion, isThinking, newGame,
  humanColor, chooseSide, depth, setDepth,mode,setMode,whiteTime,blackTime,isOver,moveHistory,stats,resetStats,lastMove
} = useChessGame()
const orientedRanks = humanColor === 'b' ? [...RANKS].reverse() : RANKS;
const orientedFiles = humanColor === 'b' ? [...FILES].reverse() : FILES;

  return (
    <>
    <button onClick={newGame} className='rounded bg-neutral=-700 px-4 py-2 text-sm font-medium hover:bg-neutral-600 border'>
      New Game
    </button>


    <div className="flex w-full max-w-[min(90vw,512px)] flex-wrap items-center justify-center gap-x-4 gap-y-2">
  {/* mode */}
  <div className="flex gap-1">
    {([['vs Computer', 'ai'], ['2 Players', 'local']] as const).map(([label, m]) => (
      <button
        key={m}
        onClick={() => setMode(m)}
        className={`whitespace-nowrap rounded px-3 py-1.5 text-xs sm:text-sm ${
          mode === m ? 'bg-emerald-600' : 'bg-neutral-700 hover:bg-neutral-600'
        }`}
      >
        {label}
      </button>
    ))}
  </div>

  {/* side */}
  <div className="flex gap-1">
    {([['White', 'w'], ['Black', 'b']] as const).map(([label, c]) => (
      <button
        key={label}
        onClick={() => chooseSide(c)}
        className={`whitespace-nowrap rounded px-3 py-1.5 text-xs sm:text-sm ${
          humanColor === c ? 'bg-emerald-600' : 'bg-neutral-700 hover:bg-neutral-600'
        }`}
      >
        Play {label}
      </button>
    ))}
  </div>

  {/* difficulty (AI only) */}
  {mode === 'ai' && (
    <div className="flex gap-1">
      {([['Easy', 2], ['Medium', 3], ['Hard', 4]] as const).map(([label, d]) => (
        <button
          key={label}
          onClick={() => setDepth(d)}
          className={`whitespace-nowrap rounded px-3 py-1.5 text-xs sm:text-sm ${
            depth === d ? 'bg-emerald-600' : 'bg-neutral-700 hover:bg-neutral-600'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )}
</div>


    <GameInfo turn = {turn} status={status}  isThinking={isThinking}/>
      <div className="flex gap-4">
  <Clock label="White" seconds={whiteTime} isActive={turn === 'w' && !isOver} />
  <Clock label="Black" seconds={blackTime} isActive={turn === 'b' && !isOver} />
</div>
<div className='flex flex-col items-center gap-4 md:flex-row md:items-start'>
  <Leaderboard stats={stats} onReset={resetStats} />
    <div className='relative'>

    <div className="grid grid-cols-8 w-[min(90vw,512px)] border-4 border-neutral-700 shadow-2xl">
      {orientedRanks.map((rank, row) =>
        orientedFiles.map((file, col) => {
          const squareName = `${file}${rank}`;
          const isLight = (FILES.indexOf(file)+rank) % 2 === 0;
          const piece = board[8 - rank][FILES.indexOf(file)];
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
              isLastMove={!!lastMove && (squareName === lastMove.from || squareName === lastMove.to)}
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

  <MoveList moves={moveHistory} />
  
</div>
    
    
    
    </>
    
  );
}

