import Link from 'next/link';
import {
  FiActivity,
  FiArrowRight,
  FiBell,
  FiCheckCircle,
  FiEye,
  FiFilePlus,
  FiMousePointer,
  FiSend,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { EmptyState } from '@/components/shared/EmptyState';
import type { ActivityEvent, ActivityType } from '@/types/activity';

const STYLE: Record<ActivityType, { icon: IconType; chip: string }> = {
  paid: { icon: FiCheckCircle, chip: 'bg-emerald-100 text-emerald-600' },
  sent: { icon: FiSend, chip: 'bg-sky-100 text-sky-600' },
  opened: { icon: FiEye, chip: 'bg-violet-100 text-violet-600' },
  clicked: { icon: FiMousePointer, chip: 'bg-amber-100 text-amber-600' },
  created: { icon: FiFilePlus, chip: 'bg-surface-muted text-muted' },
  reminder: { icon: FiBell, chip: 'bg-accent text-accent-foreground' },
};

/**
 * Render `description`, coloring any occurrence of the given tokens (the
 * customer name and invoice number). Tokens come from structured fields on the
 * event, so the highlight is exact rather than a fragile parse of the sentence.
 */
function highlightDescription(
  description: string,
  tokens: { value: string; className: string }[],
): React.ReactNode {
  // Longest first so an invoice number that contains another token wins.
  const active = tokens
    .filter((t) => t.value)
    .sort((a, b) => b.value.length - a.value.length);
  if (active.length === 0) return description;

  const escaped = active.map((t) => t.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = description.split(new RegExp(`(${escaped.join('|')})`, 'g'));

  return parts.map((part, i) => {
    const match = active.find((t) => t.value === part);
    return match ? (
      <span key={i} className={match.className}>
        {part}
      </span>
    ) : (
      part
    );
  });
}

/** Relative time, e.g. "5m ago", "3h ago", "2d ago". */
function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const m = Math.round(diffMs / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

export function ActivityFeed({
  events,
  title = 'Recent Activity',
  seeAllHref,
}: {
  events: ActivityEvent[];
  title?: string;
  seeAllHref?: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all <FiArrowRight className="size-4" />
          </Link>
        )}
      </div>
      {events.length === 0 ? (
        <EmptyState
          bordered={false}
          size="sm"
          icon={FiActivity}
          title="No activity yet"
          description="Invoice events — sent, viewed, paid — will stream in here as they happen."
        />
      ) : (
        <ul className="space-y-0.5 px-3 pb-3">
          {events.map((e) => {
          const { icon: Icon, chip } = STYLE[e.type];
          return (
            <li
              key={e.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-surface-muted"
            >
              <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${chip}`}>
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  {highlightDescription(e.description, [
                    { value: e.customerName, className: 'font-medium text-primary' },
                    { value: e.invoiceNumber, className: 'font-medium text-sky-600' },
                  ])}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {e.invoiceNumber} · {timeAgo(e.at)}
                </p>
              </div>
            </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
