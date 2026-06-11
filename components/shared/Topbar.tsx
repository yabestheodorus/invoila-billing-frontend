'use client';

import { usePathname } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';
import { Avatar } from './Avatar';
import { ThemeToggle } from './ThemeToggle';

const LABELS: { match: string; label: string }[] = [
  { match: '/dashboard', label: 'Overview' },
  { match: '/activity', label: 'Activity' },
  { match: '/invoices', label: 'Invoices' },
  { match: '/payments', label: 'Payments' },
  { match: '/reminders', label: 'Reminders' },
  { match: '/settings', label: 'Settings' },
];

export function Topbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const label = LABELS.find((l) => pathname.startsWith(l.match))?.label ?? 'Overview';

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface px-6">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>

      <div className="relative ml-2 hidden w-full max-w-sm md:block">
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
          type="search"
          placeholder="Search data..."
          className="w-full rounded-lg border border-border bg-surface-muted py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
        />
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        <ThemeToggle />
        <Avatar name={userName} className="size-8" />
        <span className="hidden text-sm font-medium md:inline">{userName}</span>
      </div>
    </header>
  );
}
