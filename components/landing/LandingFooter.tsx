import Image from 'next/image';
import Link from 'next/link';

const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { href: '/login', label: 'Sign in' },
      { href: '/signup', label: 'Create account' },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/favicon.png"
                alt="Invoila"
                width={32}
                height={32}
                className="size-8 rounded-xl"
              />
              <span className="font-heading text-lg font-semibold tracking-tight">
                Invoila
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted">
              Real-time invoice &amp; payment management for Indonesian SMEs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <p className="text-sm font-semibold">{col.heading}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted transition hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted">
          © {new Date().getFullYear()} Invoila. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
