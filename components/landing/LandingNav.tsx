import Image from 'next/image';
import Link from 'next/link';

const LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#pricing', label: 'Pricing' },
];

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/favicon.png"
            alt="Invoila"
            width={32}
            height={32}
            className="size-8 rounded-xl"
          />
          <span className="font-heading text-lg font-semibold tracking-tight">Invoila</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
