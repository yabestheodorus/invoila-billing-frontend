export type ActivityType = 'sent' | 'opened' | 'clicked' | 'paid' | 'created' | 'reminder';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  invoiceNumber: string;
  /** Billed-to customer name — highlighted within `description` in the feed. */
  customerName: string;
  description: string;
  /** ISO datetime string. */
  at: string;
}

/** A step in an invoice's lifecycle; `at` is null when it hasn't happened. */
export interface TimelineEvent {
  type: 'sent' | 'received' | 'opened' | 'clicked' | 'paid';
  at: string | null;
}
