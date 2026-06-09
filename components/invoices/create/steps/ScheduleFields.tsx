'use client';

import type { InvoiceForm } from '../useInvoiceForm';
import { FieldInfo, inputClass, labelClass, NumberField, TextField } from '@/components/shared/form-fields';
import { XIcon } from '../icons';
import { formatIDR } from '@/lib/format';

type ScheduleType = 'one_time' | 'recurring' | 'installments' | 'deposit_balance';

const TYPES: { id: ScheduleType; label: string }[] = [
  { id: 'one_time', label: 'One-time' },
  { id: 'recurring', label: 'Recurring' },
  { id: 'installments', label: 'Installments' },
  { id: 'deposit_balance', label: 'Deposit + Balance' },
];

/** Billing schedule — type selector + per-type fields (recurring / installments / deposit). */
export function ScheduleFields({ form }: { form: InvoiceForm }) {
  return (
    <fieldset className="space-y-4">
      {/* Schedule type */}
      <form.Field name="schedule.type">
        {(f) => (
          <div className="space-y-1.5">
            <span className={labelClass}>Repeat</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => f.handleChange(t.id)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    f.state.value === t.id
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted hover:text-foreground'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </form.Field>

      {/* Conditional fields */}
      <form.Subscribe selector={(s) => s.values.schedule.type}>
        {(type) => (
          <>
            {type === 'recurring' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="schedule.repeat">
                  {(f) => (
                    <div className="space-y-1.5">
                      <label className={labelClass}>Repeat every</label>
                      <select
                        className={inputClass}
                        value={f.state.value ?? 'monthly'}
                        onChange={(e) => f.handleChange(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    </div>
                  )}
                </form.Field>
                <form.Field name="schedule.until">
                  {(f) => <TextField field={f} label="Until date" type="date" isRequired={false} />}
                </form.Field>
              </div>
            )}

            {type === 'installments' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field name="schedule.count">
                  {(f) => (
                    <NumberField field={f} label="Number of invoices" min={2} max={24} isRequired={false} />
                  )}
                </form.Field>
                <form.Field name="schedule.interval">
                  {(f) => (
                    <div className="space-y-1.5">
                      <label className={labelClass}>Interval</label>
                      <select
                        className={inputClass}
                        value={f.state.value ?? 'monthly'}
                        onChange={(e) => f.handleChange(e.target.value as 'weekly' | 'monthly')}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </form.Field>
              </div>
            )}

            {type === 'deposit_balance' && <PaymentTerms form={form} />}
          </>
        )}
      </form.Subscribe>
    </fieldset>
  );
}

/**
 * Custom deposit + balance terms — an add/remove rows editor. Each row is a
 * payment term (label + IDR amount + due date); the amounts must add up to the
 * invoice total. The backend creates one invoice per term.
 */
function PaymentTerms({ form }: { form: InvoiceForm }) {
  const cols = 'grid grid-cols-[1fr_130px_150px_28px] items-center gap-2';

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <span className={labelClass}>Payment terms</span>
        <p className="text-xs text-muted">
          Split the total into deposits/milestones — add as many as you need. Amounts must add up
          to the invoice total.
        </p>
      </div>

      <div className={`${cols} text-[11px] font-medium uppercase tracking-wide text-muted`}>
        <span>Term</span>
        <span className="text-right">Amount (IDR)</span>
        <span>Due date</span>
        <span />
      </div>

      <form.Field name="schedule.terms" mode="array">
        {(termsField) => {
          const terms = termsField.state.value ?? [];
          return (
            <div className="space-y-2">
              {terms.map((term, i) => (
                <div key={term.id} className={cols}>
                  <form.Field name={`schedule.terms[${i}].label`}>
                    {(f) => (
                      <input
                        className={inputClass}
                        placeholder="e.g. Deposit"
                        value={f.state.value}
                        onChange={(e) => f.handleChange(e.target.value)}
                        onBlur={f.handleBlur}
                      />
                    )}
                  </form.Field>
                  <form.Field name={`schedule.terms[${i}].amount`}>
                    {(f) => (
                      <input
                        type="number"
                        min="0"
                        className={`${inputClass} text-right`}
                        value={f.state.value}
                        onChange={(e) => f.handleChange(Number(e.target.value) || 0)}
                        onBlur={f.handleBlur}
                      />
                    )}
                  </form.Field>
                  <form.Field name={`schedule.terms[${i}].dueDate`}>
                    {(f) => (
                      <input
                        type="date"
                        className={inputClass}
                        value={f.state.value ?? ''}
                        onChange={(e) => f.handleChange(e.target.value)}
                        onBlur={f.handleBlur}
                      />
                    )}
                  </form.Field>
                  <button
                    type="button"
                    onClick={() => termsField.removeValue(i)}
                    disabled={terms.length === 1}
                    aria-label="Remove term"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-surface-muted hover:text-foreground disabled:opacity-30"
                  >
                    <XIcon small />
                  </button>
                </div>
              ))}

              <form.Subscribe
                selector={(s) =>
                  [s.values.schedule.terms, s.values.items, s.values.discountPct] as const
                }
              >
                {([scheduleTerms, items, discountPct]) => {
                  const allocated = (scheduleTerms ?? []).reduce((n, t) => n + (t.amount || 0), 0);
                  const subtotal = items.reduce((n, it) => n + it.qty * it.price, 0);
                  const total = subtotal - Math.round((subtotal * discountPct) / 100);
                  const matches = allocated === total;
                  return (
                    <div className="flex items-center justify-between pt-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          termsField.pushValue({
                            id: crypto.randomUUID(),
                            label: '',
                            amount: 0,
                            dueDate: '',
                          })
                        }
                        className="text-sm font-medium text-muted hover:text-foreground"
                      >
                        + Add term
                      </button>
                      <span
                        className={`text-sm font-semibold tabular-nums ${
                          matches ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {formatIDR(allocated)} / {formatIDR(total)}
                      </span>
                    </div>
                  );
                }}
              </form.Subscribe>

              <FieldInfo field={termsField} />
            </div>
          );
        }}
      </form.Field>
    </div>
  );
}
