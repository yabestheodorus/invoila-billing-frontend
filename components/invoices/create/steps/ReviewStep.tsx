'use client';

import type { InvoiceForm } from '../useInvoiceForm';
import { MailIcon, SendIcon } from '../icons';
import { FieldInfo, labelClass, TextAreaField, TextField } from '@/components/shared/form-fields';
import { isRequired, normalizeSchedule, scheduleSummary } from '@/lib/invoice-utils';
import { invoiceSchema } from '@/types/invoice-form';
import { formatIDR } from '@/lib/format';

/** Step 2 — "Your invoice is ready": email recipient, message, and Send. */
export function ReviewStep({ form }: { form: InvoiceForm }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Your invoice is ready</h1>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
        Take one last look before you submit. Submitting this form creates the invoice and emails it to your customer — once sent, it{' '}
        <span className="rounded bg-accent px-1 font-semibold text-accent-foreground">can&apos;t be edited</span>.
      </p>

      <form.Subscribe
        selector={(s) =>
          [s.values.schedule, s.values.items, s.values.discountPct] as const
        }
      >
        {([schedule, items, discountPct]) => {
          const sched = normalizeSchedule(schedule);
          if (sched.type === 'one_time') return null;
          const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
          const total = subtotal - Math.round((subtotal * discountPct) / 100);
          let detail = '';
          if (sched.type === 'installments') {
            detail = `${formatIDR(Math.round(total / sched.count))} per invoice`;
          } else if (sched.type === 'deposit_balance') {
            detail = sched.terms
              .map((t) => `${formatIDR(t.amount)} ${t.label || 'term'}`)
              .join(' · ');
          }
          return (
            <div className="mt-6 rounded-xl border border-border bg-surface-muted px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Billing schedule
              </p>
              <p className="mt-1 text-sm font-medium">{scheduleSummary(sched)}</p>
              {detail && <p className="text-xs text-muted">{detail}</p>}
            </div>
          );
        }}
      </form.Subscribe>

      <div className="mt-6 space-y-5">
        <form.Field name="to.email">
          {(field) => (
            <div className="space-y-1.5">
              <label htmlFor="to-email" className={labelClass}>
                To
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <MailIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="to-email"
                  className="w-full bg-transparent text-sm outline-none"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>

        <form.Field name="cc">{(field) => <TextField field={field} label="Cc"
          isRequired={isRequired(invoiceSchema.shape.cc)}
        />}</form.Field>

        <form.Field name="message">
          {(field) => <TextAreaField field={field} label="Message" rows={3}
            isRequired={isRequired(invoiceSchema.shape.message)}
          />}
        </form.Field>

        <form.Subscribe selector={(s) => [s.values.to.name, s.isSubmitting] as const}>
          {([toName, isSubmitting]) => (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => form.handleSubmit()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SendIcon className="h-4 w-4" />
              {isSubmitting ? 'Sending…' : `Send to ${toName || 'customer'}`}
            </button>
          )}
        </form.Subscribe>

        <div className="text-center">
          <button type="button" className="text-sm font-medium text-muted hover:text-foreground">
            Create without sending
          </button>
        </div>
      </div>
    </div>
  );
}
