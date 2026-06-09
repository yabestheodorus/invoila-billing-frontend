import { formatDateTime } from '@/lib/format';
import type { TimelineEvent } from '@/types/activity';

const LABEL: Record<TimelineEvent['type'], string> = {
  sent: 'Invoice sent',
  received: 'Delivered to inbox',
  opened: 'Opened by customer',
  clicked: 'Clicked payment link',
  paid: 'Payment completed',
};

export function InvoiceActivityTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="rounded-lg border border-black/10 p-6 dark:border-white/15">
      <h2 className="text-base font-semibold">Activity</h2>
      <ol className="mt-4 space-y-0">
        {events.map((event, index) => {
          const done = event.at !== null;
          const last = index === events.length - 1;
          return (
            <li key={event.type} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`size-3 shrink-0 rounded-full ${
                    done ? 'bg-emerald-500' : 'border border-black/25 bg-transparent dark:border-white/30'
                  }`}
                />
                {!last && (
                  <span className="my-1 w-px flex-1 bg-black/10 dark:bg-white/15" aria-hidden />
                )}
              </div>
              <div className={`pb-5 ${last ? 'pb-0' : ''}`}>
                <p className={`text-sm font-medium ${done ? '' : 'text-foreground/40'}`}>
                  {LABEL[event.type]}
                </p>
                <p className="text-xs text-foreground/50">
                  {done && event.at ? formatDateTime(event.at) : 'Pending'}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
