import Link from 'next/link';
import { Avatar } from '@/components/shared/Avatar';
import { formatDateTime, formatIDR } from '@/lib/format';
import type { PaymentDetail, PaymentMethod, PaymentStatus } from '@/types/payment';

const METHOD_LABEL: Record<PaymentMethod, string> = {
  bank_transfer: 'Bank transfer',
  ewallet: 'E-wallet',
  credit_card: 'Credit card',
  qris: 'QRIS',
};

const STATUS_STYLE: Record<PaymentStatus, string> = {
  settlement: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  failed: 'bg-rose-100 text-rose-800 ring-rose-200',
  refund: 'bg-slate-100 text-slate-700 ring-slate-200',
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  settlement: 'Settled',
  pending: 'Pending',
  failed: 'Failed',
  refund: 'Refunded',
};

/** One label/value row; renders nothing when the value is empty. */
function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-6 border-b border-border py-2.5 last:border-0">
      <dt className="shrink-0 text-muted">{label}</dt>
      <dd className="break-all text-right font-medium">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">{title}</h2>
      <dl className="text-sm">{children}</dl>
    </section>
  );
}

export function PaymentDetailView({ detail }: { detail: PaymentDetail }) {
  const methodFields: [string, string | null][] = [
    ['Bank', detail.bank],
    ['Virtual account', detail.vaNumber],
    ['Biller code', detail.billerCode],
    ['Bill key', detail.billKey],
    ['Store', detail.store],
    ['Card', detail.maskedCard],
    ['Card type', detail.cardType],
    ['Approval code', detail.approvalCode],
  ];
  const hasMethodDetails = methodFields.some(([, v]) => v);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">Amount</p>
            <p className="mt-1 font-heading text-4xl font-bold tabular-nums">
              {formatIDR(detail.amount)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {detail.currency}
              {detail.method ? ` · ${METHOD_LABEL[detail.method]}` : ''}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[detail.status]}`}
          >
            {STATUS_LABEL[detail.status]}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2.5">
            <Avatar name={detail.customerName} className="size-9" />
            <div>
              <p className="text-sm font-medium">{detail.customerName || '—'}</p>
              <Link
                href={`/invoices/${detail.invoiceId}`}
                className="text-xs text-muted hover:text-primary hover:underline"
              >
                Invoice {detail.invoiceNumber}
              </Link>
            </div>
          </div>
          {detail.paidAt && (
            <p className="text-sm text-muted">Paid {formatDateTime(detail.paidAt)}</p>
          )}
        </div>
      </div>

      <Section title="Transaction">
        <Field label="Transaction ID" value={detail.transactionId} />
        <Field label="Order ID" value={detail.orderId} />
        <Field label="Payment type" value={detail.paymentType} />
        <Field label="Transaction status" value={detail.transactionStatus} />
        <Field label="Fraud status" value={detail.fraudStatus} />
        <Field label="Status code" value={detail.statusCode} />
        <Field label="Status message" value={detail.statusMessage} />
      </Section>

      {hasMethodDetails && (
        <Section title="Payment method">
          {methodFields.map(([label, value]) => (
            <Field key={label} label={label} value={value} />
          ))}
        </Section>
      )}

      <Section title="Timeline">
        <Field
          label="Transaction time"
          value={detail.transactionTime ? formatDateTime(detail.transactionTime) : null}
        />
        <Field
          label="Settlement time"
          value={detail.settlementTime ? formatDateTime(detail.settlementTime) : null}
        />
        <Field
          label="Expiry time"
          value={detail.expiryTime ? formatDateTime(detail.expiryTime) : null}
        />
        <Field label="Recorded" value={formatDateTime(detail.createdAt)} />
        <Field label="Last updated" value={formatDateTime(detail.updatedAt)} />
      </Section>

      {detail.raw && (
        <details className="rounded-2xl border border-border bg-surface p-6">
          <summary className="cursor-pointer text-[11px] font-medium uppercase tracking-wide text-muted">
            Raw Midtrans response
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-muted p-4 text-xs leading-relaxed">
            {JSON.stringify(detail.raw, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
