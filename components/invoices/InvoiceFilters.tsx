import Link from 'next/link';
import type { InvoiceFilter } from '@/types/invoice';

const TABS: { label: string; value: InvoiceFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Overdue', value: 'overdue' },
];

/**
 * Status filter as a segmented control. Pure links that set `?status=` so
 * filtering stays on the server (SSR) — no client JavaScript required.
 */
export function InvoiceFilters({ current }: { current: InvoiceFilter }) {
  return (
    <div className="inline-flex gap-1 rounded-lg border border-border bg-surface-muted p-1">
      {TABS.map((tab) => {
        const active = tab.value === current;
        const href = tab.value === 'all' ? '/invoices' : `/invoices?status=${tab.value}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              active ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
