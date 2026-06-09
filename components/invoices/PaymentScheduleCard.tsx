import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate, formatIDR } from '@/lib/format';
import { scheduleSummary } from '@/lib/invoice-utils';
import type { Invoice, InvoiceDetail } from '@/types/invoice';

/**
 * Billing schedule for the invoice. Installment / deposit + balance schedules
 * create multiple invoices grouped under one BillingSchedule; this lists each
 * one with its own due date, amount, and status (linking to its detail), plus
 * paid progress. Render only when `detail.billingSchedule` is set.
 */
export function PaymentScheduleCard({ detail }: { detail: InvoiceDetail }) {
  const billingSchedule = detail.billingSchedule;
  if (!billingSchedule) return null;

  const { invoices, schedule, total } = billingSchedule;
  const hasInvoices = invoices.length > 0;

  const paidCount = invoices.filter((i) => i.status === 'paid').length;
  const collected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="rounded-lg border border-black/10 p-6 dark:border-white/15">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">Billing schedule</h2>
        {hasInvoices && (
          <span className="text-xs font-medium text-foreground/60">
            {paidCount} of {invoices.length} paid
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-foreground/60">{scheduleSummary(schedule)}</p>

      {hasInvoices && (
        <>
          <p className="mt-1 text-xs text-foreground/50">
            Each row is its own invoice — select one to open it.
          </p>
          <ul className="mt-3 divide-y divide-black/5 dark:divide-white/10">
            {invoices.map((inv) => (
              <ScheduleRow key={inv.id} invoice={inv} current={inv.id === detail.invoice.id} />
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 text-sm dark:border-white/15">
            <span className="text-foreground/60">Collected</span>
            <span className="font-semibold tabular-nums">
              {formatIDR(collected)} <span className="text-foreground/50">/ {formatIDR(total)}</span>
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/** One invoice in the schedule. The current invoice is shown flat; others link out. */
function ScheduleRow({ invoice, current }: { invoice: Invoice; current: boolean }) {
  const body = (
    <>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {invoice.description}
          {current && (
            <span className="ml-2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
              This invoice
            </span>
          )}
        </p>
        <p className="text-xs text-foreground/50">
          {invoice.invoiceNumber} · due {formatDate(invoice.dueDate)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm font-medium tabular-nums">{formatIDR(invoice.amount)}</span>
        <StatusBadge status={invoice.status} />
      </div>
    </>
  );

  if (current) {
    return <li className="flex items-center justify-between gap-4 py-3">{body}</li>;
  }
  return (
    <li>
      <Link
        href={`/invoices/${invoice.id}`}
        className="-mx-2 flex items-center justify-between gap-4 rounded-md px-2 py-3 transition hover:bg-black/5 dark:hover:bg-white/5"
      >
        {body}
      </Link>
    </li>
  );
}
