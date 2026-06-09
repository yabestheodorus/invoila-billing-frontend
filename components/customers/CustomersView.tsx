'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiPlus, FiUsers } from 'react-icons/fi';
import { createCustomer } from '@/lib/api/customers';
import { EMPTY_PARTY, addressLines, isRequired } from '@/lib/invoice-utils';
import { TextField } from '@/components/shared/form-fields';
import { EmptyState } from '@/components/shared/EmptyState';
import { partySchema } from '@/types/invoice-form';
import type { Customer } from '@/types/customer';
import type { Party } from '@/types/invoice';

const shape = partySchema.shape;

/** Empty optionals → undefined so `postal`/`line2` validate as optional. */
function validate({ value }: { value: Party }): { fields: Record<string, string> } | undefined {
  const result = partySchema.safeParse({
    ...value,
    line2: value.line2 || undefined,
    postal: value.postal || undefined,
  });
  if (result.success) return undefined;

  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (key && !fields[key]) fields[key] = issue.message;
  }
  return { fields };
}

export function CustomersView({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: { ...EMPTY_PARTY } as Party,
    validators: { onChange: validate },
    onSubmit: async ({ value }) => {
      try {
        await createCustomer({
          ...value,
          line2: value.line2 || undefined,
          postal: value.postal || undefined,
        });
        toast.success('Customer created.');
        form.reset();
        setOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to create customer.');
      }
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted">Your saved customers, billable on invoices.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <FiPlus className="size-4" />
          New customer
        </button>
      </div>

      {open && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-4 rounded-xl border border-border bg-surface p-6"
        >
          <h2 className="text-base font-semibold">New customer</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field name="name">
              {(f) => <TextField field={f} label="Name" isRequired={isRequired(shape.name)} />}
            </form.Field>
            <form.Field name="email">
              {(f) => <TextField field={f} label="Email" type="email" isRequired={isRequired(shape.email)} />}
            </form.Field>
          </div>
          <form.Field name="line1">
            {(f) => <TextField field={f} label="Address line 1" isRequired={isRequired(shape.line1)} />}
          </form.Field>
          <form.Field name="line2">
            {(f) => <TextField field={f} label="Address line 2" isRequired={isRequired(shape.line2)} />}
          </form.Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <form.Field name="city">
              {(f) => <TextField field={f} label="City" isRequired={isRequired(shape.city)} />}
            </form.Field>
            <form.Field name="postal">
              {(f) => <TextField field={f} label="Postal code" isRequired={isRequired(shape.postal)} />}
            </form.Field>
            <form.Field name="country">
              {(f) => <TextField field={f} label="Country" isRequired={isRequired(shape.country)} />}
            </form.Field>
          </div>
          <div className="flex items-center gap-2">
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving…' : 'Save customer'}
                </button>
              )}
            </form.Subscribe>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {customers.length === 0 ? (
          <EmptyState
            bordered={false}
            icon={FiUsers}
            title="No customers yet"
            description="Add your first customer above, or save one on the fly while creating an invoice — they’ll auto-fill billing details next time."
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/50">
                  <td className="px-6 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-6 py-3 text-muted">{c.email}</td>
                  <td className="px-6 py-3 text-muted">{addressLines(c as Party).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
