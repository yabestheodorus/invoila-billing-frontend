/**
 * Invoice domain — entities and read models. Types only (no zod, no runtime).
 * Create-side validation lives in `types/invoice-form.ts`; values and helpers
 * live in `lib/invoice.ts`.
 */

export type InvoiceStatus = 'pending' | 'paid' | 'overdue';

export type InvoiceFilter = InvoiceStatus | 'all';

/** Aggregates for the invoices-page summary cards (across all invoices). */
export interface InvoiceSummary {
  outstandingAmount: number;
  unpaidCount: number;
  paidAmount: number;
  paidCount: number;
  overdueAmount: number;
  overdueCount: number;
}

/** A billable party — the invoice "From" (business) or "Bill to" (customer). */
export interface Party {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  postal?: string;
  country: string;
}

/** A single line item on an invoice. */
export interface LineItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

/**
 * One custom payment term (deposit + balance / milestone payments). The total
 * is split across these rows by `pct` (which must sum to 100%); one invoice is
 * created per term, due on `dueDate`.
 */
export interface ScheduleTerm {
  id: string;
  label: string;
  /** Amount in IDR for this term (deposit + balance). Terms sum to the total. */
  amount: number;
  dueDate?: string;
}

/**
 * Normalized billing schedule — only the fields each type actually uses. This
 * is what gets stored on a {@link BillingSchedule} (and what the create form
 * produces on submit), e.g. a one-time invoice carries no recurrence fields.
 */
export type InvoiceSchedule =
  | { type: 'one_time' }
  | { type: 'recurring'; repeat: 'weekly' | 'monthly' | 'yearly'; until?: string }
  | { type: 'installments'; count: number; interval: 'weekly' | 'monthly' }
  | { type: 'deposit_balance'; terms: ScheduleTerm[] };

/** Everything the shared invoice document / preview needs to render. */
export interface PreviewData {
  from: Party;
  to: Party;
  // invoiceNo is only present once the backend has assigned it (detail view);
  // the create-form live preview has no number yet.
  meta: { invoiceNo?: string; issued: string; dueDate: string };
  items: LineItem[];
  discountPct: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  notes: string;
}

/**
 * A single invoice. Flat — an invoice never references another invoice.
 * Invoices created together share the same `billingScheduleId`; "siblings" are
 * derived from that, not stored on the invoice itself.
 */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  /** Opaque public handle for the customer pay link (`/pay/<payToken>`), not the id. */
  payToken: string;
  customerName: string;
  customerEmail: string;
  /** Amount in IDR (no decimals). */
  amount: number;
  description: string;
  status: InvoiceStatus;
  /** ISO date string (yyyy-mm-dd). */
  dueDate: string;
  /** ISO datetime string. */
  createdAt: string;
  /** ISO datetime string, or null when unpaid. */
  paidAt: string | null;
  /** Email engagement timestamps (Resend webhook). ISO datetime, or null. */
  emailSentAt: string | null;
  emailReceivedAt: string | null;
  emailReadAt: string | null;
  emailClickedAt: string | null;
  /**
   * The {@link BillingSchedule} this invoice belongs to. Omitted for a
   * standalone one-time invoice.
   */
  billingSchedule?: BillingSchedule;
}

/**
 * Groups the invoices produced by a recurring / installment / deposit + balance
 * schedule. One-time invoices have none. Member invoices reference it by id.
 */
export interface BillingSchedule {
  id: string;
  schedule: InvoiceSchedule;
  /** The full amount being split across the schedule's invoices. */
  total: number;
  /** ISO datetime string. */
  createdAt: string;
}

/**
 * Read model for the invoice detail page — composed at read time, not a table.
 * Bundles the invoice with its create-time detail (parties, items, totals,
 * notes) and, when it belongs to one, its {@link BillingSchedule} plus the
 * invoices in that schedule (its siblings).
 */
export interface InvoiceDetail {
  invoice: Invoice;
  from: Party;
  to: Party;
  items: LineItem[];
  discountPct: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  notes: string;
  /** Null for standalone one-time invoices. */
  billingSchedule: (BillingSchedule & { invoices: Invoice[] }) | null;
}
