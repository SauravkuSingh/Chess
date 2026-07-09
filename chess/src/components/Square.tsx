import type { Color, PieceSymbol } from "chess.js";
import { Piece } from "./Piece";

type SquareProps = {
  square: string;
  isLight: boolean;
  isSelected: boolean;
  fileLabel?: string;
  rankLabel?: number;
  piece: { type: PieceSymbol; color: Color } | null;
  isLegalMove: boolean;
  isLastMove: boolean;
  onSelect: (square: string) => void;
};

export function Square({
  square,
  isLight,
  isSelected,
  fileLabel,
  rankLabel,
  piece,
  isLegalMove,
  isLastMove,
  onSelect,
}: SquareProps) {
  const labelColor = isLight ? "text-[#b58863]" : "text-[#f0d9b5]";

  return (
    <div
      onClick={() => onSelect(square)}
      className={`relative aspect-square flex items-center justify-center cursor-pointer ${
        isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"
      } ${isSelected ? "ring-4 ring-inset ring-yellow-400" : ""}`}
    >
      {isLastMove && (
        <span className="pointer-events-none absolute inset-0 bg-yellow-400/40" />
      )}

      {/* labels + piece — unchanged */}
      {rankLabel && (
        <span
          className={`absolute top-0.5 left-1 text-xs font-semibold ${labelColor}`}
        >
          {rankLabel}
        </span>
      )}
      {fileLabel && (
        <span
          className={`absolute bottom-0.5 right-1 text-xs font-semibold ${labelColor}`}
        >
          {fileLabel}
        </span>
      )}
      {isLegalMove && !piece && (
        <span className="pointer-events-none absolute h-1/3 w-1/3 rounded-full bg-black/30" />
      )}
      {isLegalMove && piece && (
        <span className="pointer-events-none absolute inset-1 rounded-full border-4 border-black/30" />
      )}
      {piece && <Piece type={piece.type} color={piece.color} />}
    </div>
  );
}
