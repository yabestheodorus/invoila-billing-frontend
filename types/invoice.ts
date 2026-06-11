/**
 * Invoice domain — entities and read models. Shared shapes (`Party`, `LineItem`)
 * are inferred from their single source of truth: the zod schemas in
 * `types/invoice-form.ts`. Values/helpers live in `lib/invoice-utils.ts`.
 */
import { z } from 'zod';
import { partySchema, itemSchema } from './invoice-form';

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

/**
 * A billable party — the invoice "From" (business) or "Bill to" (customer).
 * Single source of truth = `partySchema` (zod) in `types/invoice-form.ts`.
 */
export type Party = z.infer<typeof partySchema>;

/** A single line item on an invoice (inferred from `itemSchema`). */
export type LineItem = z.infer<typeof itemSchema>;

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

/** The slice a scheduled invoice bills within its order (absent for one-time). */
export interface AmountDue {
  /** e.g. "Installment 2 of 3", a term label, or "Recurring (monthly)". */
  label: string;
  amount: number;
  /** ISO date string (yyyy-mm-dd). */
  dueDate: string;
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
  /** This invoice's portion within its schedule; null for one-time invoices. */
  amountDue: AmountDue | null;
  notes: string;
  /** Null for standalone one-time invoices. */
  billingSchedule: (BillingSchedule & { invoices: Invoice[] }) | null;
}
