'use client';

import type { Customer } from '@/types/customer';
import type { InvoiceForm } from '../useInvoiceForm';
import { addressLines, customerToParty, EMPTY_PARTY, isRequired } from '@/lib/invoice-utils';
import { invoiceSchema } from '@/types/invoice-form';
import { labelClass, TextField } from '@/components/shared/form-fields';
import { CustomerCombobox } from './CustomerCombobox';

const toShape = invoiceSchema.shape.to.shape;
const metaShape = invoiceSchema.shape.meta.shape;

/** Step 0 — read-only business profile (From) + editable Bill-to + invoice meta. */
export function BillingStep({ form, customers }: { form: InvoiceForm; customers: Customer[] }) {
  // "From" is the user's business profile — read-only here (fetched from the DB
  // later), shown as a compact summary instead of editable inputs.
  const fromProfile = form.getFieldValue('from');
  const fromAddress = addressLines(fromProfile);

  return (
    <div className="space-y-8">
      <fieldset className="space-y-2">
        <legend className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          From (your business)
        </legend>
        <div className="rounded-lg border border-border bg-surface-muted px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-base font-semibold text-foreground">
              {fromProfile.name}
            </h3>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
              Profile
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted">{fromProfile.email}</p>
          {fromAddress.length > 0 && (
            <p className="mt-1 text-xs text-muted">{fromAddress.join(', ')}</p>
          )}
        </div>
      </fieldset>

      <div className="border-t border-border" />

      <fieldset className="space-y-4">
        <legend className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          Bill to (customer)
        </legend>
        <div className="space-y-1.5">
          <label className={labelClass}>Select customer</label>
          <CustomerCombobox
            customers={customers}
            defaultQuery={form.getFieldValue('to.name')}
            onSelect={(id) => {
              const c = customers.find((x) => x.id === id);
              if (c) {
                form.setFieldValue('to', customerToParty(c));
                form.setFieldValue('customerId', c.id);
              }
            }}
            onCreate={(name) => {
              // Ad-hoc customer: clear the saved id so the backend creates one.
              form.setFieldValue('to', { ...EMPTY_PARTY, name });
              form.setFieldValue('customerId', undefined);
            }}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <form.Field name="to.name">
            {(field) => <TextField field={field} label="Name" isRequired={isRequired(toShape.name)} />}
          </form.Field>
          <form.Field name="to.email">
            {(field) => (
              <TextField field={field} label="Email" type="email" isRequired={isRequired(toShape.email)} />
            )}
          </form.Field>
        </div>
        <form.Field name="to.line1">
          {(field) => <TextField field={field} label="Address line 1" isRequired={isRequired(toShape.line1)} />}
        </form.Field>
        <form.Field name="to.line2">
          {(field) => <TextField field={field} label="Address line 2" isRequired={isRequired(toShape.line2)} />}
        </form.Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <form.Field name="to.city">
            {(field) => <TextField field={field} label="City" isRequired={isRequired(toShape.city)} />}
          </form.Field>
          <form.Field name="to.postal">
            {(field) => <TextField field={field} label="Postal code" isRequired={isRequired(toShape.postal)} />}
          </form.Field>
          <form.Field name="to.country">
            {(field) => <TextField field={field} label="Country" isRequired={isRequired(toShape.country)} />}
          </form.Field>
        </div>
      </fieldset>

      <div className="border-t border-border" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.Field name="meta.issued">
          {(field) => (
            <TextField field={field} label="Issued" type="date" isRequired={isRequired(metaShape.issued)} />
          )}
        </form.Field>
        <form.Field name="meta.dueDate">
          {(field) => (
            <TextField field={field} label="Due date" type="date" isRequired={isRequired(metaShape.dueDate)} />
          )}
        </form.Field>
      </div>
      <p className="text-xs text-muted">
        The invoice number is assigned automatically when you create the invoice.
      </p>
    </div>
  );
}
