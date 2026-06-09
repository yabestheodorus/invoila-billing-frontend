import type { InvoiceStatus } from '@/types/invoice';

const STYLES: Record<InvoiceStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  paid: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  overdue: 'bg-rose-100 text-rose-800 ring-rose-200',
};

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
