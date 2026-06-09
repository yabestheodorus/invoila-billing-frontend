import type { Metadata } from 'next';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import { InvoiceFilters } from '@/components/invoices/InvoiceFilters';
import { InvoiceSummary } from '@/components/invoices/InvoiceSummary';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { BillingSchedulesCard } from '@/components/invoices/BillingSchedulesCard';
import { Pagination } from '@/components/shared/Pagination';
import {
  INVOICES_PER_PAGE,
  getBillingSchedules,
  getInvoiceSummary,
  getInvoices,
} from '@/lib/api/server';
import type { InvoiceFilter } from '@/types/invoice';

export const metadata: Metadata = {
  title: 'Invoices · Invoila',
};

const VALID_FILTERS: InvoiceFilter[] = ['pending', 'paid', 'overdue'];

/** Take the first value when a query param arrives repeated (`?x=a&x=b`). */
function first(raw: string | string[] | undefined): string | undefined {
  return Array.isArray(raw) ? raw[0] : raw;
}

function parseFilter(raw: string | string[] | undefined): InvoiceFilter {
  const v = first(raw);
  return v && (VALID_FILTERS as string[]).includes(v) ? (v as InvoiceFilter) : 'all';
}

function parsePositiveInt(raw: string | string[] | undefined, fallback: number): number {
  const n = Number(first(raw));
  return Number.isInteger(n) && n >= 1 ? n : fallback;
}

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; page?: string | string[]; limit?: string | string[] }>;
}) {
  const sp = await searchParams;
  const filter = parseFilter(sp.status);
  const page = parsePositiveInt(sp.page, 1);
  const limit = parsePositiveInt(sp.limit, INVOICES_PER_PAGE);

  // Table is a server-paginated/filtered page; the summary aggregates ALL
  // invoices (so it stays correct regardless of page/filter).
  const [list, summary, billingSchedules] = await Promise.all([
    getInvoices({ page, limit, status: filter }),
    getInvoiceSummary(),
    getBillingSchedules(),
  ]);

  // Build a page URL that preserves the active filter + non-default limit.
  const hrefForPage = (p: number) => {
    const qs = new URLSearchParams();
    if (filter !== 'all') qs.set('status', filter);
    if (limit !== INVOICES_PER_PAGE) qs.set('limit', String(limit));
    qs.set('page', String(p));
    return `/invoices?${qs.toString()}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="mt-1 text-sm text-muted">Track and manage all your invoices.</p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <FiPlus className="size-4" />
          Create Invoice
        </Link>
      </div>

      <InvoiceSummary summary={summary} />

      <div className="space-y-4">
        <InvoiceFilters current={filter} />
        <InvoiceTable invoices={list.data} />
        <Pagination meta={list.pagination} hrefForPage={hrefForPage} />
      </div>

      <BillingSchedulesCard schedules={billingSchedules} />
    </div>
  );
}
