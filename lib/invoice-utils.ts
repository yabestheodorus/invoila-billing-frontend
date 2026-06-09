/**
 * Invoice utilities — values (defaults, business profile) and pure helpers.
 * Types live in `types/invoice.ts`; zod schemas in `types/invoice-form.ts`.
 */
import { z } from 'zod';
import { formatDate, formatIDR } from '@/lib/format';
import type { TimelineEvent } from '@/types/activity';
import type { Customer } from '@/types/customer';
import type { Invoice, InvoiceSchedule, Party } from '@/types/invoice';
import type { InvoiceFormValues, InvoiceSubmitValues } from '@/types/invoice-form';

export const EMPTY_PARTY: Party = {
  name: '',
  email: '',
  line1: '',
  line2: '',
  city: '',
  postal: '',
  country: '',
};

/** Local-time `YYYY-MM-DD` for a date input (not `toISOString`, which is UTC and can shift the day). */
function toDateInput(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today as `YYYY-MM-DD` (local time). */
export function todayISO(): string {
  return toDateInput(new Date());
}

/** `days` from today as `YYYY-MM-DD` (local time). */
export function addDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateInput(d);
}

export const DEFAULT_VALUES: InvoiceFormValues = {
  customerId: undefined,
  // The real "From" is the user's business profile (passed into the create
  // panel); this empty fallback is only used when none is set up yet.
  from: EMPTY_PARTY,
  to: { name: '', email: '', line1: '', line2: '', city: '', postal: '', country: '' },
  // Issued today; payment due 20 days out.
  meta: { issued: todayISO(), dueDate: addDaysISO(20) },
  items: [
    { id: 'item-1', description: 'UI/UX design — marketing landing page', qty: 1, price: 5_000_000 },
    { id: 'item-2', description: 'Brand asset pack', qty: 1, price: 1_250_000 },
  ],
  discountPct: 10,
  schedule: {
    type: 'one_time',
    repeat: 'monthly',
    until: '',
    count: 3,
    interval: 'monthly',
    terms: [
      { id: 'term-1', label: 'Deposit', amount: 0, dueDate: '' },
      { id: 'term-2', label: 'Balance', amount: 0, dueDate: '' },
    ],
  },
  notes: 'Payment due within 14 days. Bank transfer / QRIS accepted.',
  message: 'Hi Reza,\nThanks for your business! Please find the invoice attached.',
  cc: '',
};

/**
 * Map a master-data customer to the billable `Party` shape (drops `id`).
 * Nullable address fields are coalesced to `''` — the form schema's optional
 * fields accept an empty string but reject `null` ("expected string, received
 * null"), so a customer with no postal must not push `null` into form state.
 */
export function customerToParty(c: Customer): Party {
  return {
    name: c.name,
    email: c.email,
    line1: c.line1,
    line2: c.line2 ?? '',
    city: c.city,
    postal: c.postal ?? '',
    country: c.country,
  };
}

/** Address lines for display, dropping empties. City + postal share a line. */
export function addressLines(p: Party): string[] {
  const cityLine = [p.city, p.postal].filter(Boolean).join(' ');
  return [p.line1, p.line2 || '', cityLine, p.country].filter(Boolean);
}

/** Short due date, e.g. "5 Nov" (no year), for the email header. */
export function shortDate(iso: string): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(iso));
}

/** Whether a schema field is required (i.e. not wrapped in `.optional()`). */
export function isRequired(field: z.ZodType): boolean {
  return !(field instanceof z.ZodOptional);
}

/** Strip schedule fields irrelevant to the chosen type (for submit/storage). */
export function normalizeSchedule(s: InvoiceFormValues['schedule']): InvoiceSchedule {
  switch (s.type) {
    case 'recurring':
      return { type: 'recurring', repeat: s.repeat ?? 'monthly', ...(s.until ? { until: s.until } : {}) };
    case 'installments':
      return { type: 'installments', count: s.count ?? 2, interval: s.interval ?? 'monthly' };
    case 'deposit_balance':
      return { type: 'deposit_balance', terms: s.terms ?? [] };
    default:
      return { type: 'one_time' };
  }
}

/** Convert editable form values into the clean submit payload. */
export function toSubmitValues(v: InvoiceFormValues): InvoiceSubmitValues {
  return { ...v, schedule: normalizeSchedule(v.schedule) };
}

/** Human summary of a billing schedule, e.g. "Repeats monthly until 20 Dec 2026". */
export function scheduleSummary(s: InvoiceSchedule): string {
  switch (s.type) {
    case 'recurring':
      return `Repeats ${s.repeat}${s.until ? ` until ${formatDate(s.until)}` : ''}`;
    case 'installments':
      return `${s.count} invoices, ${s.interval}`;
    case 'deposit_balance': {
      if (s.terms.length === 0) return 'Deposit + balance';
      return s.terms.map((t) => `${t.label} ${formatIDR(t.amount)}`).join(' · ');
    }
    default:
      return 'One-time invoice';
  }
}

/**
 * The invoice lifecycle timeline (PRD 1.9) from REAL tracking timestamps: the
 * email send + the Resend webhook (delivered → received, opened → read) + the
 * payment. `at` is null for steps that haven't happened yet ("Pending").
 */
export function getInvoiceTimeline(invoice: Invoice): TimelineEvent[] {
  return [
    { type: 'sent', at: invoice.emailSentAt },
    { type: 'received', at: invoice.emailReceivedAt },
    { type: 'opened', at: invoice.emailReadAt },
    { type: 'clicked', at: invoice.emailClickedAt },
    { type: 'paid', at: invoice.paidAt },
  ];
}
