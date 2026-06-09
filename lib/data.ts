import { cache } from 'react';
import type { Reminder } from '@/types/reminder';

/**
 * Remaining dummy data. Everything else has moved to the real API
 * (`lib/api/server.ts`). Reminders are still a UI skeleton — there's no
 * reminders backend yet — so they're served from this hardcoded list.
 */

/** Small artificial delay so streaming / loading states are observable. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const reminders: Reminder[] = [
  {
    id: 'rem-1',
    invoiceNumber: 'INV-1003',
    customerName: 'PT Maju Jaya',
    amount: 12_500_000,
    dueDate: '2026-05-20',
    kind: 'overdue',
  },
  {
    id: 'rem-2',
    invoiceNumber: 'INV-1004',
    customerName: 'Budi Santoso',
    amount: 750_000,
    dueDate: '2026-06-15',
    kind: 'upcoming',
  },
  {
    id: 'rem-3',
    invoiceNumber: 'INV-1001',
    customerName: 'Reza Pratama',
    amount: 5_000_000,
    dueDate: '2026-06-20',
    kind: 'upcoming',
  },
  {
    id: 'rem-4',
    invoiceNumber: 'INV-1009',
    customerName: 'Katering Bu Yanti',
    amount: 1_800_000,
    dueDate: '2026-06-01',
    kind: 'due_today',
  },
];

export const getReminders = cache(async (): Promise<Reminder[]> => {
  await delay(150);
  return reminders;
});
