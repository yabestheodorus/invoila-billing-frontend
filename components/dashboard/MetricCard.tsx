import type { IconType } from 'react-icons';

type Tone = 'green' | 'orange' | 'red';

const TONES: Record<Tone, { chip: string; badge: string; value: string; bar: string }> = {
  green: {
    chip: 'bg-emerald-100 text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700',
    value: 'text-foreground',
    bar: 'bg-emerald-500',
  },
  orange: {
    chip: 'bg-accent text-accent-foreground',
    badge: 'bg-surface-muted text-muted',
    value: 'text-primary',
    bar: 'bg-primary',
  },
  red: {
    chip: 'bg-rose-100 text-rose-600',
    badge: 'bg-rose-50 text-rose-600',
    value: 'text-rose-600',
    bar: 'bg-rose-500',
  },
};

export function MetricCard({
  tone,
  icon: Icon,
  label,
  value,
  badge,
  barWidth,
}: {
  tone: Tone;
  icon: IconType;
  label: string;
  value: string;
  badge: string;
  /** 0–100, width of the progress bar. */
  barWidth: number;
}) {
  const t = TONES[tone];
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between">
        <span className={`flex size-10 items-center justify-center rounded-xl ${t.chip}`}>
          <Icon className="size-5" />
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${t.badge}`}>{badge}</span>
      </div>
      <p className="mt-4 text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${t.value}`}>{value}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
