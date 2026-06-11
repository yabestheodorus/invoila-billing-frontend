import Link from 'next/link';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { InvoiceDocument } from '@/components/invoices/create/preview/InvoiceDocument';
import { ExportPdfButton } from '@/components/invoices/ExportPdfButton';
import { SendEmailButton } from '@/components/invoices/SendEmailButton';
import { PaymentScheduleCard } from '@/components/invoices/PaymentScheduleCard';
import { InvoiceActivityTimeline } from '@/components/invoices/InvoiceActivityTimeline';
import { formatDate } from '@/lib/format';
import type { TimelineEvent } from '@/types/activity';
import type { InvoiceDetail as InvoiceDetailModel } from '@/types/invoice';

export function InvoiceDetail({
  detail,
  timeline,
}: {
  detail: InvoiceDetailModel;
  timeline: TimelineEvent[];
}) {
  const { invoice } = detail;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
      {/* ── Left: invoice info (header, actions, schedule, activity) ── */}
      <div className="no-print space-y-6">
        <div className="rounded-lg border border-black/10 dark:border-white/15">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 p-6 dark:border-white/15">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{invoice.invoiceNumber}</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="mt-1 text-sm text-foreground/60">
              {invoice.customerName} · {invoice.customerEmail}
            </p>
            <p className="mt-0.5 text-xs text-foreground/50">
              Created {formatDate(invoice.createdAt)} · Due {formatDate(invoice.dueDate)}
              {invoice.paidAt ? ` · Paid ${formatDate(invoice.paidAt)}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-6">
          <SendEmailButton invoiceId={invoice.id} />
          <ExportPdfButton />
          <button
            type="button"
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-white/20 dark:hover:bg-rose-950/30"
          >
            Delete
          </button>
          <Link
            href={`/pay/${invoice.payToken}`}
            target="_blank"
            className="ml-auto rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
          >
            Payment page ↗
          </Link>
        </div>
        </div>

        {/* Billing schedule + its invoices (installments / deposit + balance). */}
        {detail.billingSchedule && <PaymentScheduleCard detail={detail} />}

        <InvoiceActivityTimeline events={timeline} />
      </div>

      {/* ── Right: the invoice document (also the only thing Export PDF prints) ── */}
      <div className="print-area lg:sticky lg:top-6">
        <InvoiceDocument detail={detail} />
      </div>
    </div>
  );
}
