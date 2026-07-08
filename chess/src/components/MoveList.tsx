type MoveListProps = {
  moves: string[];
};

export function MoveList({ moves }: MoveListProps) {
  // chess is played in pairs: White then Black. Group the flat list into rows.
  const rows = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({ num: i / 2 + 1, white: moves[i], black: moves[i + 1] });
  }

  return (
    <div className="h-[min(90vw,512px)] w-40 shrink-0 overflow-y-auto rounded bg-neutral-800 p-2 text-sm">
      <h2 className="mb-1 text-xs uppercase tracking-wide text-neutral-400">Moves</h2>
      {rows.length === 0 && <p className="text-neutral-500">No moves yet</p>}
      <ol>
        {rows.map((r) => (
          <li key={r.num} className="flex gap-2 py-0.5">
            <span className="w-6 text-neutral-500">{r.num}.</span>
            <span className="w-14">{r.white}</span>
            <span className="w-14 text-neutral-300">{r.black ?? ''}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
