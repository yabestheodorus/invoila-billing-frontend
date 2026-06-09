import Link from 'next/link';
import Image from 'next/image';

/**
 * Global 404 — rendered for any unmatched route (and any `notFound()` that
 * isn't caught by a closer not-found boundary). Standalone/centered: it renders
 * in the root layout only, without the app sidebar.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: 'radial-gradient(55% 60% at 50% 0%, rgba(217,119,87,0.16), transparent)' }}
      />

      <div className="relative mb-6 flex items-center gap-2">
        <Image src="/favicon.png" alt="Invoila" width={32} height={32} className="rounded-lg" />
        <span className="font-heading text-lg font-semibold">Invoila</span>
      </div>

      <p className="relative font-heading text-6xl font-bold tracking-tight text-foreground">404</p>
      <h1 className="relative mt-3 text-lg font-semibold">Page not found</h1>
      <p className="relative mt-1 max-w-sm text-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>

      <Link
        href="/dashboard"
        className="relative mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
