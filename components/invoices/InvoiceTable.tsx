import Link from 'next/link';
import { FiFileText } from 'react-icons/fi';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar } from '@/components/shared/Avatar';
import { EmptyState } from '@/components/shared/EmptyState';
import { CopyLinkButton } from '@/components/invoices/CopyLinkButton';
import { formatDate, formatIDR } from '@/lib/format';
import type { Invoice } from '@/types/invoice';

const th = 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted';
const td = 'px-6 py-4 align-middle';

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        icon={FiFileText}
        title="No invoices to show here"
        description="Once you create invoices, they’ll appear in this list — track status, amounts and payment links at a glance."
        action={{ label: 'Create invoice', href: '/invoices/new' }}
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
              <th className={th}>Due date</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Amount</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-border transition last:border-0 hover:bg-surface-muted"
              >
                <td className={td}>
                  <Link
                    href={`/invoices/${invoice.id}`}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                  >
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td className={td}>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={invoice.customerName} className="size-8" />
                    <span className="font-medium">{invoice.customerName}</span>
                  </div>
                </td>
                <td className={`${td} text-muted`}>{formatDate(invoice.dueDate)}</td>
                <td className={td}>
                  <StatusBadge status={invoice.status} />
                </td>
                <td className={`${td} text-right font-medium tabular-nums`}>
                  {formatIDR(invoice.amount)}
                </td>
                <td className={`${td} text-right`}>
                  <CopyLinkButton payToken={invoice.payToken} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
