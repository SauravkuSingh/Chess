type ClockProps = {
  label: string;
  seconds: number;
  isActive: boolean;
};

function format(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Clock({ label, seconds, isActive }: ClockProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded px-3 py-1 font-mono text-lg ${
        isActive ? 'bg-emerald-700 text-white' : 'bg-neutral-800 text-neutral-300'
      } ${seconds <= 10 ? 'text-red-400' : ''}`}
    >
      <span className="text-xs uppercase tracking-wide">{label}</span>
      <span>{format(seconds)}</span>
    </div>
  );
}
