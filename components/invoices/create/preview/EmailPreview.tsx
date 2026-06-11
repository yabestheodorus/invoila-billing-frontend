import { formatIDR } from '@/lib/format';
import { shortDate } from '@/lib/invoice-utils';
import type { InvoiceDetail } from '@/types/invoice';
import { PartyView } from './PartyView';

/* ── Email tab: the email preview ────────────────────── */
export function EmailPreview({
  detail,
  message,
}: {
  detail: InvoiceDetail;
  message: string;
}) {
  const { invoice, from, to, items } = detail;
  const senderName = from.name.trim() || 'Invoila';
  const body = message.trim().split('\n').map((l) => l.trim()).filter(Boolean).join(' ');
  const due = shortDate(invoice.dueDate);

  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-border">
      {/* mac window bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="flex-1 text-center text-xs text-muted">Mail</span>
      </div>

      {/* email header */}
      <dl className="space-y-1 border-b border-border px-5 py-4 text-[11px] text-muted ">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 uppercase tracking-wide">To:</dt>
          <dd className="text-foreground">{to.email || '—'}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 uppercase tracking-wide">Subject:</dt>
          <dd className="font-medium text-foreground">New invoice from {senderName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 uppercase tracking-wide">Cc:</dt>
          <dd />
        </div>
      </dl>

      {/* email body */}
      <div className="bg-surface-muted px-6 py-6">
        {/* sender row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
              {senderName.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-semibold">{senderName}</span>
          </div>
          <span className="text-xs text-muted">Invoicing with Invoila</span>
        </div>

        {/* big amount / due */}
        <div className="mt-8 text-center">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            Invoice #{invoice.invoiceNumber || '—'}
          </p>
          <p className="mt-1 font-heading text-5xl font-bold tracking-tight tabular-nums">
            {formatIDR(detail.total)}
          </p>
          {due && <p className="mt-1 text-xl font-medium text-muted">due {due}</p>}
        </div>

        {/* message bubble */}
        {body && (
          <div className="my-8 mx-4 rounded-2xl bg-surface px-6 py-5 text-center ring-1 ring-border">
            <p className="text-[11px] uppercase tracking-wide text-muted">{senderName} says</p>
            <p className="mt-3 text-[18px] leading-relaxed text-foreground">{body}</p>
          </div>
        )}

        <div className="mx-4 rounded-2xl border border-border bg-surface p-8">
          {/* from / to */}
          <div className=" grid grid-cols-2 gap-6 ">
            <PartyView label="From" party={from} compact />
            <PartyView label="To" party={to} compact />
          </div>

          {/* invoice details */}
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Invoice details
            </p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4">
                  <dt className="text-foreground">{item.description || '—'}</dt>
                  <dd className="tabular-nums">{formatIDR(item.qty * item.price)}</dd>
                </div>
              ))}
              <div className="flex justify-between text-muted">
                <dt>Discount ({detail.discountPct}%)</dt>
                <dd className="tabular-nums">-{formatIDR(detail.discountAmount)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2.5 font-semibold">
                <dt>Total due</dt>
                <dd className="tabular-nums">{formatIDR(detail.total)}</dd>
              </div>
            </dl>

            {detail.notes && (
              <div className="mt-4 space-y-1 text-[11px] leading-relaxed text-muted">
                <p className="font-medium uppercase tracking-wide">Notes</p>
                <p className="whitespace-pre-line">{detail.notes}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Pay invoice
          </button>
        </div>
      </div>
    </div>
  );
}
