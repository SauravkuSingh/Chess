# ♟️ React Chess

A fully playable chess game built from scratch with **React 19 + TypeScript + Tailwind CSS v4**. Play a friend locally (hot-seat) or challenge an AI opponent powered by a **minimax + alpha-beta** search. Chess rules are handled by [chess.js](https://github.com/jhlywa/chess.js); the entire UI, interaction, and AI are custom-built.

## ✨ Features

- ✅ Full chess rules — legal moves only, check, checkmate, stalemate, and draws
- ♜ Special moves — castling, en passant, and pawn promotion (with a piece picker)
- 🖱️ Click-to-move with legal-move highlights (dots for moves, rings for captures)
- 🤖 AI opponent — minimax with alpha-beta pruning, 3 difficulty levels
- 🔄 Play as White or Black — the board flips to your perspective
- 📊 Live turn indicator, game status, and a New Game reset
- 📱 Responsive board that scales to any screen
- 🎨 Real piece graphics (the classic Wikipedia/chessboard.js set)

## 🛠️ Tech Stack

| Tool | Role |
|------|------|
| **React 19** | UI components & state |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling (via `@tailwindcss/vite`) |
| **Vite** | Build tool / dev server |
| **chess.js** | Chess rules engine (move generation, validation, game state) |

## 🚀 Getting Started

```bash
cd chess
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
```

## 📂 Project Structure

```
chess/
├─ public/
│  └─ pieces/                # 12 piece images: wP.png … bK.png
└─ src/
   ├─ ai/
   │  ├─ evaluate.ts         # scores a position by material
   │  └─ minimax.ts          # minimax + alpha-beta search
   ├─ components/
   │  ├─ Board.tsx           # the 8×8 grid + control panel
   │  ├─ Square.tsx          # one square: color, labels, piece, highlights
   │  ├─ Piece.tsx           # renders a piece image
   │  ├─ GameInfo.tsx        # turn + status display
   │  └─ PromotionPicker.tsx # promotion overlay
   ├─ constants/
   │  ├─ board.ts            # file/rank arrays
   │  └─ pieces.ts           # piece-image path helper
   ├─ hooks/
   │  └─ useChessGame.ts     # game controller: all state + logic
   └─ App.tsx                # app shell
```

## 🏗️ Architecture

The app is split into three clean layers:

1. **Model (rules)** — `chess.js`. All chess knowledge lives here. It never touches React.
2. **Controller** — `useChessGame.ts`. A custom hook that owns the game state and exposes clean data + actions to the UI.
3. **View** — the React components. They render whatever the hook gives them and report clicks back up.

The golden rule: **components never talk to chess.js directly** — everything flows through the hook.

## 📖 Code Walkthrough

### `constants/board.ts`
The coordinate system for rendering.

```ts
export const FILES = ['a','b','c','d','e','f','g','h'] as const; // columns, left→right
export const RANKS = [8,7,6,5,4,3,2,1] as const;                 // rows, top→bottom
```

`RANKS` starts at 8 so White sits at the bottom. `as const` makes these readonly tuples with literal types, which helps TypeScript catch invalid squares.

### `constants/pieces.ts`
Maps a piece to its image file. Images live in `public/pieces/` (Vite serves them at `/pieces/*`), named `color + UPPERCASE type`, e.g. `wP.png`.

```ts
export function pieceImage(color: Color, type: PieceSymbol): string {
  return `/pieces/${color}${type.toUpperCase()}.png`;
}
```

### `hooks/useChessGame.ts` — the heart of the app
This hook owns **all** game state and logic. Key pieces:

- **The engine lives in a `useRef`** so it persists across re-renders and isn't recreated:
  ```ts
  const gameRef = useRef(new Chess());
  const game = gameRef.current;
  ```
- **A `fen` state acts as the re-render trigger.** Because the engine is mutated in place (its reference never changes), React won't re-render on a move by itself. After each move we call `setFen(game.fen())` to force a re-render — and derived values like `game.board()` then reflect the new position.
- **Selection & legal moves** are derived, not stored:
  ```ts
  const legalMoves = selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true })
    : [];
  const legalTargets = legalMoves.map(m => m.to);
  ```
- **`handleSquareClick`** is the click state machine: if a piece is selected and you click a legal target → move (or open the promotion picker); otherwise (re)select or clear.
- **`completePromotion`** finishes a promotion move once the player chooses a piece.
- **Status** (`"White to move"`, `"Checkmate — White wins"`, etc.) is derived from `game.isCheckmate()`, `isStalemate()`, `isDraw()`, `isCheck()`.
- **The AI effect** watches the position and replies when it's the AI's turn:
  ```ts
  useEffect(() => {
    const g = gameRef.current;
    if (g.turn() !== aiColor || g.isGameOver()) return;
    const timer = setTimeout(() => {
      const move = findBestMove(g, depth);
      if (move) { g.move(move); setFen(g.fen()); }
    }, 400);
    return () => clearTimeout(timer);
  }, [fen, aiColor, depth]);
  ```
  The dependency array is critical: the effect re-runs whenever the position (`fen`), side (`aiColor`), or difficulty (`depth`) changes.

### `components/Board.tsx`
Renders the control panel (difficulty, side, New Game), the status, and the 8×8 grid. It maps over `RANKS × FILES` (reversed when playing Black) and, for each square, looks up its piece **by identity** so it stays correct in both orientations:

```ts
const isLight = (FILES.indexOf(file) + rank) % 2 === 0;
const piece = board[8 - rank][FILES.indexOf(file)];
```

The grid is a single CSS grid (`grid-cols-8`) — 64 squares flow into 8 rows automatically.

### `components/Square.tsx`
One square. It handles its background color, coordinate labels (on the edges), the selection ring, the legal-move markers (dot for a quiet move, ring for a capture), and renders a `<Piece>` if occupied. It reports clicks via an `onSelect(square)` callback.

### `components/Piece.tsx`
Just renders the piece image, sized to fill its square:

```tsx
<img src={pieceImage(color, type)} draggable={false}
     className="pointer-events-none h-[85%] w-[85%] select-none object-contain" />
```

### `components/GameInfo.tsx`
Shows a color dot for the side to move, the status text, and an animated "AI thinking…" hint.

### `components/PromotionPicker.tsx`
An overlay (`absolute inset-0`) that dims the board and shows four piece buttons (Q/R/B/N) in the promoting color. Clicking one calls `onChoose(piece)`.

## 🧠 How the AI Works

The AI evaluates positions and searches ahead to pick the best move.

**Evaluation (`ai/evaluate.ts`)** — counts material from White's perspective (positive = good for White):

```ts
const PIECE_VALUE = { p:1, n:3, b:3, r:5, q:9, k:0 };
```

**Search (`ai/minimax.ts`)** — **minimax with alpha-beta pruning**:
- White nodes **maximize** the score, Black nodes **minimize** it (each side assumes the other plays optimally).
- It descends the game tree with `game.move()` / `game.undo()` as make/unmake, scoring leaf positions with `evaluate`.
- **Alpha-beta pruning** skips branches that can't affect the result — the same answer as full minimax, far fewer positions searched.
- Difficulty = search depth (Easy 2 / Medium 3 / Hard 4 plies).

The search runs on a **copy** of the game (`new Chess(game.fen())`) so it never disturbs the real board.

## 🔮 Possible Improvements

- Move history & captured-pieces panel (`game.history({ verbose: true })`)
- Run the AI in a **Web Worker** so deeper searches don't freeze the UI
- Move ordering + piece-square tables for a stronger AI
- Undo button (`game.undo()`), sound effects, last-move highlighting

## 🙏 Credits

- Chess rules engine: [chess.js](https://github.com/jhlywa/chess.js)
- Piece images: the "wikipedia" set by Colin M.L. Burnett (via [chessboard.js](https://chessboardjs.com/) / Wikimedia Commons)
