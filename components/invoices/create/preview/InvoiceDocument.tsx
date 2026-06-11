import Image from 'next/image';
import { FiImage } from 'react-icons/fi';
import { formatDate, formatIDR } from '@/lib/format';
import { addressLines } from '@/lib/invoice-utils';
import type { InvoiceDetail } from '@/types/invoice';
import { PartyView } from './PartyView';

/**
 * The invoice document — reads the canonical detail object straight through
 * (nested), no flattened view DTO. Used by the detail page, the public pay page,
 * and the live create preview (which builds a draft detail from form state).
 */
export function InvoiceDocument({ detail }: { detail: InvoiceDetail }) {
  const { invoice, from, to, items, amountDue } = detail;
  const fromLines = addressLines(from);

  return (
    <div className="relative mx-auto flex max-w-xl flex-col overflow-hidden rounded-xl bg-surface shadow-sm ring-1 ring-border">
      {/* Top accent bar — brand ornament. */}
      <div className="h-1.5 w-full bg-linear-to-r from-primary to-primary-hover" />
      {/* Soft brand glow behind the header (decorative). */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-10 size-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex flex-col p-6 sm:p-8">
        {/* Header: title + number (left) · customer logo placeholder (right) */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">
              Invoice
            </h2>
            {invoice.invoiceNumber ? (
              <p className="mt-1 text-sm font-medium tabular-nums text-muted">
                #{invoice.invoiceNumber}
              </p>
            ) : (
              <span className="mt-2 inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">
                Draft
              </span>
            )}
          </div>
          {/* Business logo — falls back to a placeholder when none is set. */}
          {from.logoUrl ? (
            <Image
              src={from.logoUrl}
              alt={from.name ? `${from.name} logo` : 'Business logo'}
              width={160}
              height={64}
              className="h-14 w-auto max-w-40 shrink-0 object-contain"
            />
          ) : (
            <div className="flex size-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-border text-muted">
              <FiImage className="size-5" />
              <span className="text-[8px] font-medium uppercase tracking-wide">
                Logo
              </span>
            </div>
          )}
        </header>

        <div className="my-6 border-t border-border" />

        {/* Bill-to (full width) combined with invoice meta on the right. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <PartyView label="Bill to" party={to} />
          <dl className="space-y-3 sm:text-right">
            <Meta label="Invoice no" value={invoice.invoiceNumber || '—'} />
            <Meta
              label="Issued"
              value={invoice.createdAt ? formatDate(invoice.createdAt) : '—'}
            />
            <Meta
              label="Due date"
              value={invoice.dueDate ? formatDate(invoice.dueDate) : '—'}
            />
          </dl>
        </div>

        <div className="my-6 border-t border-border" />

        {/* Line items — item (+ qty × price subline) on the left, amount right */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted">
            <span>Description</span>
            <span>Amount</span>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{item.description || '—'}</p>
                <p className="mt-0.5 text-xs tabular-nums text-muted">
                  {item.qty} × {formatIDR(item.price)}
                </p>
              </div>
              <p className="shrink-0 tabular-nums">
                {formatIDR(item.qty * item.price)}
              </p>
            </div>
          ))}
        </div>

        <div className="my-6 border-t border-border" />

        <dl className="ml-auto max-w-xs space-y-2 text-sm">
          <TotalRow label="Subtotal" value={formatIDR(detail.subtotal)} muted />
          <TotalRow
            label={`Discount (${detail.discountPct}%)`}
            value={`-${formatIDR(detail.discountAmount)}`}
            muted
          />
          <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
            <dt>{amountDue ? 'Order total' : 'Total'}</dt>
            <dd className="tabular-nums">{formatIDR(detail.total)}</dd>
          </div>
        </dl>

        {/* Scheduled invoice: what's actually due on THIS invoice. */}
        {amountDue && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-accent/60 p-4">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
                Amount due · this invoice
              </p>
              {amountDue.label && (
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {amountDue.label}
                </p>
              )}
              {amountDue.dueDate && (
                <p className="text-xs text-muted">
                  Due {formatDate(amountDue.dueDate)}
                </p>
              )}
            </div>
            <p className="shrink-0 font-heading text-xl font-bold tabular-nums text-accent-foreground">
              {formatIDR(amountDue.amount)}
            </p>
          </div>
        )}

        {detail.notes && (
          <div className="mt-6 space-y-1 border-t border-border pt-4 text-[11px] leading-relaxed text-muted">
            <p className="font-medium uppercase tracking-wide">Note</p>
            <p className="whitespace-pre-line">{detail.notes}</p>
          </div>
        )}

        {/* Footer: issuing business ("From") + Invoila attribution. */}
        <footer className="mt-8 border-t border-border pt-5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
            From
          </p>
          <p className="mt-1 text-sm font-semibold">{from.name || '—'}</p>
          {from.email && <p className="text-xs text-muted">{from.email}</p>}
          {fromLines.length > 0 && (
            <p className="mt-0.5 text-xs text-muted">{fromLines.join(', ')}</p>
          )}

          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
            <Image
              src="/favicon.png"
              alt="Invoila"
              width={18}
              height={18}
              className="size-4.5 rounded"
            />
            <span className="text-[11px] text-muted">
              Powered by{' '}
              <span className="font-semibold text-foreground">Invoila</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function TotalRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? 'text-muted' : ''}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
