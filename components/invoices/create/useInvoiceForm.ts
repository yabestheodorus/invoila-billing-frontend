'use client';

import { useForm } from '@tanstack/react-form';
import { DEFAULT_VALUES } from '@/lib/invoice-utils';
import { invoiceSchema, type InvoiceFormValues } from '@/types/invoice-form';

/**
 * The create-invoice form (plain TanStack `useForm` + zod validation).
 * Exposing it through a hook lets step components share the fully-typed form
 * via `ReturnType<typeof useInvoiceForm>` — no generics to spell out.
 */
export function useInvoiceForm(
  initialValues: InvoiceFormValues = DEFAULT_VALUES,
  onSubmit?: (values: InvoiceFormValues) => void,
) {
  return useForm({
    defaultValues: initialValues,
    validators: { onChange: invoiceSchema },
    onSubmit: ({ value }) => onSubmit?.(value),
  });
}

export type InvoiceForm = ReturnType<typeof useInvoiceForm>;
