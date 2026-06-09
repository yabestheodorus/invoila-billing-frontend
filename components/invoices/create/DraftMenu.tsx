'use client';

import { useRef, useState } from 'react';
import { formatDateTime, formatIDR } from '@/lib/format';
import type { InvoiceDraft } from '@/lib/draft-store';
import { XIcon } from './icons';

/** Persisted draft total (subtotal − discount), for the dropdown summary. */
function draftTotal(d: InvoiceDraft): number {
  const subtotal = d.values.items.reduce((sum, i) => sum + (i.qty || 0) * (i.price || 0), 0);
  return subtotal - Math.round((subtotal * (d.values.discountPct || 0)) / 100);
}

function draftTitle(d: InvoiceDraft): string {
  return d.values.to?.name?.trim() || 'Untitled draft';
}

/**
 * "Drafts" dropdown shown on the create-invoice page. Lists saved drafts
 * (resume / delete). Resuming preloads the draft into the form. Skeleton-style
 * dropdown matching {@link CustomerCombobox} (focus-out closes the menu).
 */
export function DraftMenu({
  drafts,
  onResume,
  onDelete,
}: {
  drafts: InvoiceDraft[];
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const closeSoon = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
  };

  return (
    <div className="relative" onBlur={closeSoon} onFocus={cancelClose}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
      >
        Drafts
        <span className="rounded-full bg-surface-muted px-1.5 text-xs text-muted">{drafts.length}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full z-20 mb-2 max-h-80 w-80 overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
            Saved drafts
          </p>

          {drafts.length === 0 ? (
            <p className="px-3 py-3 text-sm text-muted">No saved drafts yet.</p>
          ) : (
            drafts.map((d) => (
              <div
                key={d.id}
                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-muted"
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onResume(d.id);
                    setOpen(false);
                  }}
                  className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left"
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">{draftTitle(d)}</span>
                    <span className="shrink-0 text-xs text-muted">{formatIDR(draftTotal(d))}</span>
                  </span>
                  <span className="truncate text-xs text-muted">
                    Issued {d.values.meta?.issued || '—'} · saved {formatDateTime(d.savedAt)}
                  </span>
                </button>
                <button
                  type="button"
                  aria-label="Delete draft"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onDelete(d.id)}
                  className="shrink-0 rounded-md p-1 text-muted opacity-0 transition hover:bg-foreground/10 hover:text-foreground group-hover:opacity-100"
                >
                  <XIcon small />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
