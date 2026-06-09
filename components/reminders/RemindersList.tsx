import { FiBell } from 'react-icons/fi';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatIDR } from '@/lib/format';
import type { Reminder, ReminderKind } from '@/types/reminder';

const KIND_STYLE: Record<ReminderKind, string> = {
  upcoming: 'bg-blue-100 text-blue-800 ring-blue-200',
  due_today: 'bg-amber-100 text-amber-800 ring-amber-200',
  overdue: 'bg-rose-100 text-rose-800 ring-rose-200',
};

const KIND_LABEL: Record<ReminderKind, string> = {
  upcoming: 'Upcoming',
  due_today: 'Due today',
  overdue: 'Overdue',
};

export function RemindersList({ reminders }: { reminders: Reminder[] }) {
  if (reminders.length === 0) {
    return (
      <EmptyState
        icon={FiBell}
        title="No reminders scheduled"
        description="When invoices are approaching their due date or fall overdue, they’ll show up here ready to nudge."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {reminders.map((reminder) => (
        <li
          key={reminder.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-black/10 p-4 dark:border-white/15"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{reminder.invoiceNumber}</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${KIND_STYLE[reminder.kind]}`}
              >
                {KIND_LABEL[reminder.kind]}
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground/60">
              {reminder.customerName} · due {formatDate(reminder.dueDate)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium tabular-nums">{formatIDR(reminder.amount)}</span>
            <button
              type="button"
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Send reminder
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
