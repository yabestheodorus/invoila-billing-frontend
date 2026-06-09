'use client';

import type { InvoiceForm } from '../useInvoiceForm';
import { ScheduleFields } from './ScheduleFields';

/**
 * Step 2 — billing schedule. Its own step between Items and Review: choose how
 * the invoice is billed (one-time / recurring / installments / deposit +
 * balance) and, for deposit + balance, define custom payment terms.
 */
export function ScheduleStep({ form }: { form: InvoiceForm }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing schedule</h1>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
          Choose how this invoice is billed. Leave it as a one-time invoice, or set up recurring,
          installment, or custom deposit + balance terms.
        </p>
      </div>

      <ScheduleFields form={form} />
    </div>
  );
}
