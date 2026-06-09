import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { PaginationMeta } from '@/types/pagination';

const navBase =
  'inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition';

/**
 * Page navigation driven entirely by links (SSR — no client JS). `hrefForPage`
 * builds the target URL for a given page so callers keep their own query params
 * (status, limit) intact.
 */
export function Pagination({
  meta,
  hrefForPage,
}: {
  meta: PaginationMeta;
  hrefForPage: (page: number) => string;
}) {
  const { page, limit, total, totalPages, hasPrevPage, hasNextPage } = meta;
  if (total === 0) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const state = (enabled: boolean) =>
    `${navBase} ${enabled ? 'text-foreground hover:bg-surface-muted' : 'pointer-events-none opacity-40'}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-muted">
        Showing{' '}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{' '}
        of <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={hrefForPage(page - 1)}
          aria-disabled={!hasPrevPage}
          tabIndex={hasPrevPage ? undefined : -1}
          className={state(hasPrevPage)}
        >
          <FiChevronLeft className="size-4" /> Prev
        </Link>
        <span className="px-1 text-muted">
          Page {page} of {totalPages}
        </span>
        <Link
          href={hrefForPage(page + 1)}
          aria-disabled={!hasNextPage}
          tabIndex={hasNextPage ? undefined : -1}
          className={state(hasNextPage)}
        >
          Next <FiChevronRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
