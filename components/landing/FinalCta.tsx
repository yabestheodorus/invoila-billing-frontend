import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-foreground px-6 py-16 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-24 mx-auto h-64 max-w-2xl rounded-full bg-primary/30 blur-3xl"
        />
        <h2 className="font-heading text-3xl font-bold tracking-tight text-background sm:text-4xl">
          Stop chasing payments. Start watching them arrive.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-background/70">
          Join Indonesian SMEs getting paid faster with real-time invoicing. Free to
          start — your first invoice is two minutes away.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          Get started free
          <FiArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
