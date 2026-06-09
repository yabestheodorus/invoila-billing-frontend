import type { Metadata } from 'next';
import { RemindersList } from '@/components/reminders/RemindersList';
import { getReminders } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Reminders · Invoila',
};

export default async function RemindersPage() {
  const reminders = await getReminders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reminders</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Automatic payment reminders for upcoming and overdue invoices.
        </p>
      </div>
      <RemindersList reminders={reminders} />
    </div>
  );
}
