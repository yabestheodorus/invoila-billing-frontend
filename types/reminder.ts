export type ReminderKind = 'upcoming' | 'due_today' | 'overdue';

export interface Reminder {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  kind: ReminderKind;
}
