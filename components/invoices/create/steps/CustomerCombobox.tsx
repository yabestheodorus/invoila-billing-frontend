'use client';

import { useRef, useState } from 'react';
import type { Customer } from '@/types/customer';
import { SearchIcon } from '../icons';
import { inputClass } from '@/components/shared/form-fields';

const AVATAR_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-indigo-100 text-indigo-700',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?');
}

function Avatar({ name }: { name: string }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const color = AVATAR_COLORS[h % AVATAR_COLORS.length];
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${color}`}
    >
      {initials(name)}
    </span>
  );
}

/**
 * Searchable customer picker (combobox). Typing filters the master list and
 * offers an "Add … as customer" action for the current query. UI skeleton:
 * selecting fills the form; "Add" creates an ad-hoc (unsaved) customer.
 */
export function CustomerCombobox({
  customers,
  onSelect,
  onCreate,
  defaultQuery,
}: {
  customers: Customer[];
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
  defaultQuery?: string;
}) {
  const [query, setQuery] = useState(defaultQuery ?? '');
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const q = query.trim().toLowerCase();
  const matches = q
    ? customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q),
    )
    : customers;
  const suggestions = matches.slice(0, 6);

  const closeSoon = () => {
    blurTimer.current = setTimeout(() => setOpen(false), 120);
  };
  const cancelClose = () => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
  };

  const choose = (c: Customer) => {
    onSelect(c.id);
    setQuery(c.name);
    setOpen(false);
  };
  const create = () => {
    const name = query.trim();
    if (!name) return;
    onCreate(name);
    setOpen(false);
  };

  return (
    <div className="relative" onBlur={closeSoon} onFocus={cancelClose}>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search customers…"
          className={`${inputClass} pl-9`}
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
          {query.trim() && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={create}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-muted"
            >
              <Avatar name={query} />
              <span className="text-foreground">
                Add <span className="font-medium">{query.trim()}</span> as customer
              </span>
            </button>
          )}

          <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted">
            Suggested companies
          </p>

          {suggestions.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted">No matching customers</p>
          ) : (
            suggestions.map((c) => (
              <button
                key={c.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(c)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left hover:bg-surface-muted"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={c.name} />
                  <span className="truncate text-sm font-medium text-foreground">{c.name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted">{c.email}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
