'use client';

import { formatIDR } from '@/lib/format';
import type { InvoiceForm } from '../useInvoiceForm';
import { XIcon } from '../icons';
import { inputClass, NumberField, TextAreaField } from '@/components/shared/form-fields';
import { isRequired } from '@/lib/invoice-utils';
import { invoiceSchema } from '@/types/invoice-form';

/** Red border when an item cell has been touched and is invalid. */
function cellClass(meta: { isTouched: boolean; errors: unknown[] }): string {
  const invalid = meta.isTouched && meta.errors.length > 0;
  return `${inputClass}${invalid ? ' border-rose-400' : ''}`;
}

/** Step 1 — editable line items (array field), discount, and notes. */
export function ItemsStep({ form }: { form: InvoiceForm }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_56px_110px_28px] gap-2 text-[11px] font-medium uppercase tracking-wide text-muted">
        <span>Description </span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price (IDR)</span>
        <span />
      </div>

      <form.Field name="items" mode="array">
        {(itemsField) => (
          <div className="space-y-2">
            {itemsField.state.value.map((item, i) => (
              <div key={item.id} className="grid grid-cols-[1fr_56px_110px_28px] items-center gap-2">
                <form.Field name={`items[${i}].description`}>
                  {(f) => (
                    <input
                      className={cellClass(f.state.meta)}
                      placeholder="Item description"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      onBlur={f.handleBlur}

                    />
                  )}
                </form.Field>
                <form.Field name={`items[${i}].qty`}>
                  {(f) => (
                    <input
                      type="number"
                      min="0"
                      className={`${cellClass(f.state.meta)} text-right`}
                      value={f.state.value}
                      onChange={(e) => f.handleChange(Number(e.target.value) || 0)}
                      onBlur={f.handleBlur}
                    />
                  )}
                </form.Field>
                <form.Field name={`items[${i}].price`}>
                  {(f) => (
                    <input
                      type="number"
                      min="0"
                      className={`${cellClass(f.state.meta)} text-right`}
                      value={f.state.value}
                      onChange={(e) => f.handleChange(Number(e.target.value) || 0)}
                      onBlur={f.handleBlur}
                    />
                  )}
                </form.Field>
                <button
                  type="button"
                  onClick={() => itemsField.removeValue(i)}
                  disabled={itemsField.state.value.length === 1}
                  aria-label="Remove item"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-surface-muted hover:text-foreground disabled:opacity-30"
                >
                  <XIcon small />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                itemsField.pushValue({ id: crypto.randomUUID(), description: '', qty: 1, price: 0 })
              }
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              + Add item
            </button>
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <form.Field name="discountPct">
          {
            (field) =>
              <NumberField
                field={field}
                label="Discount (%)"
                min={0}
                max={100}
                isRequired={isRequired(invoiceSchema.shape.discountPct)}
              />
          }
        </form.Field>
        <div className="flex items-end justify-end pb-1.5 text-sm">
          <span className="text-muted">Total:&nbsp;</span>
          <form.Subscribe
            selector={(s) => [s.values.items, s.values.discountPct] as const}
          >
            {([items, discountPct]) => {
              const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
              const total = subtotal - Math.round((subtotal * discountPct) / 100);
              return <span className="font-semibold tabular-nums">{formatIDR(total)}</span>;
            }}
          </form.Subscribe>
        </div>
      </div>

      <form.Field name="notes">
        {
          (field) =>
            <TextAreaField
              field={field}
              label="Notes"
              rows={2}
              isRequired={isRequired(invoiceSchema.shape.notes)}
            />
        }
      </form.Field>
    </div>
  );
}
