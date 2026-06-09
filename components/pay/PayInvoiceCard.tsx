import { FiCheckCircle } from 'react-icons/fi';
import { Avatar } from '@/components/shared/Avatar';
import { PartyView } from '@/components/invoices/create/preview/PartyView';
import { PayButton } from './PayButton';
import { shortDate } from '@/lib/invoice-utils';
import { formatDate, formatIDR } from '@/lib/format';
import type { Invoice, Party } from '@/types/invoice';

/**
 * Public customer-facing payment view (PRD User Flow 2), styled to match the
 * email preview the customer receives. "Pay" creates a Midtrans Snap link via
 * the backend and redirects the payer to the hosted Snap page.
 */
export function PayInvoiceCard({ invoice }: { invoice: Invoice }) {
  const isPaid = invoice.status === 'paid';
  const due = shortDate(invoice.dueDate);

  const from: Party = {
    name: 'Invoila Studio',
    email: 'billing@invoila.id',
    line1: '',
    line2: '',
    city: '',
    postal: '',
    country: '',
  };
  const to: Party = {
    name: invoice.customerName,
    email: invoice.customerEmail,
    line1: '',
    line2: '',
    city: '',
    postal: '',
    country: '',
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-xl sm:p-8">
      {/* sender row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={from.name} className="size-8" />
          <span className="text-sm font-semibold">{from.name}</span>
        </div>
        <span className="text-xs text-muted">Invoicing with Invoila</span>
      </div>

      {/* big amount / due */}
      <div className="mt-8 text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted">
          Invoice #{invoice.invoiceNumber}
        </p>
        <p className="mt-1 font-heading text-5xl font-bold tracking-tight tabular-nums">
          {formatIDR(invoice.amount)}
        </p>
        {due && <p className="mt-1 text-xl font-medium text-muted">due {due}</p>}
      </div>

      {/* message bubble */}
      <div className="my-8 rounded-2xl border border-border px-6 py-5 text-center">
        <p className="text-[11px] uppercase tracking-wide text-muted">{from.name} says</p>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground">
          Hi {invoice.customerName}, thanks for your business! Please review your invoice below and
          complete the payment at your convenience.
        </p>
      </div>

      {/* from / to */}
      <div className="grid grid-cols-2 gap-6">
        <PartyView label="From" party={from} compact />
        <PartyView label="To" party={to} compact />
      </div>

      {/* invoice details */}
      <div className="mt-6 border-t border-border pt-6">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Invoice details</p>
        <dl className="mt-3 space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-foreground">{invoice.description || '—'}</dt>
            <dd className="tabular-nums">{formatIDR(invoice.amount)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2.5 font-semibold">
            <dt>Total due</dt>
            <dd className="tabular-nums">{formatIDR(invoice.amount)}</dd>
          </div>
        </dl>
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
          <PayButton token={invoice.payToken} amount={invoice.amount} />
        </div>
      )}
    </div>
  );
}
