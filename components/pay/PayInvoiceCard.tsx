import { FiCheckCircle } from 'react-icons/fi';
import { Avatar } from '@/components/shared/Avatar';
import { PartyView } from '@/components/invoices/create/preview/PartyView';
import { PayButton } from './PayButton';
import { shortDate } from '@/lib/invoice-utils';
import { formatDate, formatIDR } from '@/lib/format';
import type { InvoiceDetail } from '@/types/invoice';

/**
 * Public customer-facing payment view (PRD User Flow 2), styled to match the
 * email preview the customer receives. Shows the full order breakdown (and, for
 * a scheduled invoice, the slice due on this one) above the pay action. "Pay"
 * creates a Midtrans Snap link via the backend and redirects to the hosted page.
 */
export function PayInvoiceCard({ detail }: { detail: InvoiceDetail }) {
  const { invoice, from, to, items, amountDue } = detail;
  const isPaid = invoice.status === 'paid';
  const due = shortDate(invoice.dueDate);
  const senderName = from.name || 'Your business';
  // The amount payable on THIS invoice — the portion for a scheduled child,
  // the full total for a one-time invoice.
  const amountNow = invoice.amount;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
      {/* sender row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={senderName} className="size-8" />
          <span className="text-sm font-semibold">{senderName}</span>
        </div>
        <span className="text-xs text-muted">Invoicing with Invoila</span>
      </div>

      {/* big amount / due */}
      <div className="mt-8 text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted">
          Invoice #{invoice.invoiceNumber}
        </p>
        <p className="mt-1 font-heading text-5xl font-bold tracking-tight tabular-nums">
          {formatIDR(amountNow)}
        </p>
        {amountDue?.label && (
          <p className="mt-1 text-sm font-medium text-accent-foreground">{amountDue.label}</p>
        )}
        {due && <p className="mt-1 text-xl font-medium text-muted">due {due}</p>}
      </div>

      {/* message bubble */}
      <div className="my-8 rounded-2xl border border-border px-6 py-5 text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted">{senderName} says</p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground">
          Hi {to.name || invoice.customerName}, thanks for your business! Please review your
          invoice below and complete the payment at your convenience.
        </p>
      </div>

      {/* from / to */}
      <div className="grid grid-cols-2 gap-6">
        <PartyView label="From" party={from} compact />
        <PartyView label="To" party={to} compact />
      </div>

      {/* invoice details — the original product breakdown */}
      <div className="mt-6 border-t border-border pt-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
          Invoice details
        </p>
        <dl className="mt-3 space-y-2.5 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4">
              <dt className="min-w-0">
                <span className="text-foreground">{item.description || '—'}</span>
                <span className="block text-xs tabular-nums text-muted">
                  {item.qty} × {formatIDR(item.price)}
                </span>
              </dt>
              <dd className="shrink-0 tabular-nums">{formatIDR(item.qty * item.price)}</dd>
            </div>
          ))}

          <div className="flex justify-between gap-4 border-t border-border pt-2.5 text-muted">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatIDR(detail.subtotal)}</dd>
          </div>
          {detail.discountPct > 0 && (
            <div className="flex justify-between gap-4 text-muted">
              <dt>Discount ({detail.discountPct}%)</dt>
              <dd className="tabular-nums">-{formatIDR(detail.discountAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 font-semibold">
            <dt>{amountDue ? 'Order total' : 'Total due'}</dt>
            <dd className="tabular-nums">{formatIDR(detail.total)}</dd>
          </div>
        </dl>

        {/* Scheduled invoice: what's actually due on this one. */}
        {amountDue && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-accent/60 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
                Amount due now
              </p>
              {amountDue.label && (
                <p className="text-sm font-medium text-foreground">{amountDue.label}</p>
              )}
            </div>
            <p className="shrink-0 font-heading text-lg font-bold tabular-nums text-accent-foreground">
              {formatIDR(amountNow)}
            </p>
          </div>
        )}
      </div>

      {isPaid ? (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3.5 text-emerald-800 ring-1 ring-inset ring-emerald-200">
          <FiCheckCircle className="size-5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Payment received</p>
            {invoice.paidAt && <p className="text-xs">Paid on {formatDate(invoice.paidAt)}</p>}
          </div>
        </div>
      ) : (
        <div className="mt-6 border-t border-border pt-6">
          <PayButton token={invoice.payToken} amount={amountNow} />
        </div>
      )}
    </div>
  );
}
