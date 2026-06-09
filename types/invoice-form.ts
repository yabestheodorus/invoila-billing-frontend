/**
 * Create-invoice form validation — zod schemas and the types inferred from
 * them. Types/zod only; the values (defaults) and helpers (normalize, etc.)
 * live in `lib/invoice.ts`.
 */
import { z } from 'zod';
import type { InvoiceSchedule } from './invoice';

export const partySchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.email('Enter a valid email'),
  line1: z.string().min(1, 'Required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  // Truly optional: allow empty string (not just undefined) — postal is shown
  // without a required marker, and the read-only "From" profile may have none.
  postal: z.string().optional(),
  country: z.string().min(1, 'Required'),
});

export const itemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Describe this item'),
  qty: z.number().min(1, 'Min 1'),
  price: z.number().min(0, 'Min 0'),
});

/** One custom payment-term row (arbitrary IDR amount) for deposit + balance. */
export const scheduleTermSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Required'),
  amount: z.number().min(0, 'Min 0'),
  dueDate: z.string().optional(),
});

/**
 * Billing schedule (additional-feature.md): one-time, recurring, installments,
 * or deposit + balance. Conditional fields are optional in the form (so toggling
 * type doesn't lose input) and narrowed to {@link InvoiceSchedule} on submit.
 *
 * Deposit + balance is fully custom: an arbitrary number of `terms` rows, each
 * with its own label, percentage, and due date. The percentages must total
 * 100% (enforced below) so the split adds up to the invoice total.
 */
export const scheduleSchema = z
  .object({
    type: z.enum(['one_time', 'recurring', 'installments', 'deposit_balance']),
    // recurring
    repeat: z.enum(['weekly', 'monthly', 'yearly']).optional(),
    until: z.string().optional(),
    // installments
    count: z.number().min(2).max(24).optional(),
    interval: z.enum(['weekly', 'monthly']).optional(),
    // deposit + balance (custom payment terms)
    terms: z.array(scheduleTermSchema).optional(),
  })
  .superRefine((s, ctx) => {
    if (s.type !== 'deposit_balance') return;
    const terms = s.terms ?? [];
    if (terms.length < 1) {
      ctx.addIssue({ code: 'custom', message: 'Add at least one payment term', path: ['terms'] });
    }
    // The term amounts must equal the invoice total — checked in the UI against
    // the line-item total, and enforced by the backend on submit.
  });

export const invoiceSchema = z.object({
  /** Selected existing customer; when omitted the backend reuses-by-name or creates one from `to`. */
  customerId: z.string().optional(),
  from: partySchema,
  to: partySchema,
  meta: z.object({
    // No invoiceNo: the number is assigned by the backend on create
    // (business-profile prefix + per-user counter), never entered by the user.
    issued: z.string().min(1, 'Required'),
    dueDate: z.string().min(1, 'Required'),
  }),
  items: z.array(itemSchema).min(1, 'Add at least one item'),
  discountPct: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  schedule: scheduleSchema,
  notes: z.string().optional(),
  message: z.string().optional(),
  cc: z.string().optional(),
});

export type InvoiceMeta = z.infer<typeof invoiceSchema.shape.meta>;

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;

/** Form values with the schedule narrowed for submit/storage. */
export type InvoiceSubmitValues = Omit<InvoiceFormValues, 'schedule'> & {
  schedule: InvoiceSchedule;
};
