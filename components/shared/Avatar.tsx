const COLORS = [
  'bg-emerald-100 text-emerald-700',
  'bg-orange-100 text-orange-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
}

/** Initials avatar with a deterministic warm color based on the name. */
export function Avatar({ name, className = 'h-9 w-9' }: { name: string; className?: string }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const color = COLORS[h % COLORS.length];
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${color} ${className}`}
    >
      {initials(name)}
    </span>
  );
}
