import Link from 'next/link';
import { FiFileText, FiMoreVertical } from 'react-icons/fi';
import { formatDate, formatIDR } from '@/lib/format';
import type { Invoice } from '@/types/invoice';
import { Avatar } from '@/components/shared/Avatar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';

const th = 'px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted';
const td = 'px-6 py-4 align-middle';

export function RecentInvoices({ invoices }: { invoices: Invoice[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-base font-semibold">Recent Invoices</h2>
        <Link href="/invoices" className="text-sm font-medium text-primary hover:underline">
          View all reports
        </Link>
      </div>

      {invoices.length === 0 ? (
        <EmptyState
          bordered={false}
          icon={FiFileText}
          title="No invoices yet"
          description="Create your first invoice and it’ll show up here with its status and amount."
          action={{ label: 'Create invoice', href: '/invoices/new' }}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
            <tr className="border-y border-border">
              <th className={th}>Invoice ID</th>
              <th className={th}>Client Name</th>
              <th className={th}>Amount</th>
              <th className={th}>Date</th>
              <th className={th}>Status</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0">
                <td className={`${td} font-medium`}>#{inv.invoiceNumber}</td>
                <td className={td}>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={inv.customerName} className="size-8" />
                    <span className="font-medium">{inv.customerName}</span>
                  </div>
                </td>
                <td className={`${td} tabular-nums`}>{formatIDR(inv.amount)}</td>
                <td className={`${td} text-muted`}>{formatDate(inv.createdAt)}</td>
                <td className={td}>
                  <StatusBadge status={inv.status} />
                </td>
                <td className={`${td} text-right`}>
                  <button
                    type="button"
                    aria-label="Invoice actions"
                    className="text-muted transition hover:text-foreground"
                  >
                    <FiMoreVertical className="inline size-4" />
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
