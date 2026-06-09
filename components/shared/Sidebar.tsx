'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FiGrid,
  FiFileText,
  FiFilePlus,
  FiUsers,
  FiCreditCard,
  FiBell,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { createClient } from '@/lib/supabase/client';

type NavItem = { href: string; label: string; icon: IconType, highlightedMenu?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ href: '/dashboard', label: 'Dashboard', icon: FiGrid }],
  },

  {
    label: 'Invoice',
    items: [{ href: '/invoices/new', label: 'Create Invoice', icon: FiFilePlus, highlightedMenu: true },],
  },
  {
    label: 'Billing',
    items: [
      { href: '/invoices', label: 'Invoices', icon: FiFileText },
      { href: '/customers', label: 'Customers', icon: FiUsers },
      { href: '/payments', label: 'Payments', icon: FiCreditCard },
      { href: '/reminders', label: 'Reminders', icon: FiBell },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/settings', label: 'Settings', icon: FiSettings }],
  },
];

const ALL_HREFS = GROUPS.flatMap((g) => g.items.map((i) => i.href));

/** Longest-prefix match so `/invoices/new` highlights only "Create Invoice", not "Invoices". */
function activeHref(pathname: string): string | undefined {
  return ALL_HREFS.filter((h) => pathname === h || pathname.startsWith(`${h}/`)).sort(
    (a, b) => b.length - a.length,
  )[0];
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const current = activeHref(pathname);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Signed out.');
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col border-r border-border bg-sidebar md:w-64">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5">
        <Image src="/favicon.png" alt="Invoila" width={36} height={36} className="size-9 shrink-0 rounded-xl" />
        <div className="hidden md:block">
          <p className="font-heading text-sm font-semibold leading-tight">Invoila</p>
          <p className="text-xs text-muted">SME Premium</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-3">
        {GROUPS.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="hidden px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/70 md:block">
              {group.label}
            </p>

            {group.items.map(({ href, label, icon: Icon, highlightedMenu }) => {
              const active = href === current;
              const isHighlight = highlightedMenu || false;
              return (
                <div key={href} className="relative flex items-center">

                  <Link
                    href={href}
                    title={label}
                    className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active
                      ? 'bg-sidebar-active text-foreground shadow-sm ring-1 ring-border/60'
                      : 'text-muted hover:bg-foreground/5 hover:text-foreground'
                      }`}
                  >
                    {isHighlight ? (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                        <Icon className="size-4" />
                      </span>
                    ) : (
                      <Icon className={`size-4 shrink-0 ${active ? 'text-primary' : ''}`} />
                    )}
                    <span className="hidden md:inline">{label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer actions */}
      <div className="space-y-1 border-t border-border p-2">
        <button
          type="button"
          title="Help Center"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-foreground/5 hover:text-foreground"
        >
          <FiHelpCircle className="size-5 shrink-0" />
          <span className="hidden md:inline">Help Center</span>
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          title="Log Out"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-foreground/5 hover:text-foreground"
        >
          <FiLogOut className="size-5 shrink-0" />
          <span className="hidden md:inline">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
