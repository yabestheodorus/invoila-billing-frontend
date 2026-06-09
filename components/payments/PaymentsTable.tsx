import Link from 'next/link';
import { FiCreditCard } from 'react-icons/fi';
import { Avatar } from '@/components/shared/Avatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDateTime, formatIDR } from '@/lib/format';
import type { Payment, PaymentMethod, PaymentStatus } from '@/types/payment';

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

const th = 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted';
const td = 'px-6 py-4 align-middle';

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={FiCreditCard}
        title="No payments yet"
        description="Payments land here automatically the moment a customer settles an invoice through Midtrans."
      />
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className={th}>Invoice</th>
              <th className={th}>Customer</th>
              <th className={th}>Method</th>
              <th className={th}>Status</th>
              <th className={th}>Paid at</th>
              <th className={`${th} text-right`}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b border-border transition last:border-0 hover:bg-surface-muted"
              >
                <td className={td}>
                  <Link
                    href={`/payments/${payment.id}`}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {payment.invoiceNumber}
                  </Link>
                </td>
                <td className={td}>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={payment.customerName} className="size-8" />
                    <span className="font-medium">{payment.customerName}</span>
                  </div>
                </td>
                <td className={`${td} text-muted`}>
                  {payment.method ? METHOD_LABEL[payment.method] : '—'}
                </td>
                <td className={td}>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[payment.status]}`}
                  >
                    {STATUS_LABEL[payment.status]}
                  </span>
                </td>
                <td className={`${td} text-muted`}>
                  {payment.paidAt ? formatDateTime(payment.paidAt) : '—'}
                </td>
                <td className={`${td} text-right font-medium tabular-nums`}>
                  {formatIDR(payment.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
