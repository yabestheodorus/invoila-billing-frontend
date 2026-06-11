import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiTrendingUp, FiZap } from 'react-icons/fi';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft warm glow behind the hero. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 mx-auto h-72 max-w-4xl rounded-full bg-primary/15 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        {/* Copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted">
            <FiZap className="size-3.5 text-primary" />
            Real-time invoicing for Indonesian SMEs
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Get paid faster.
            <br />
            <span className="text-primary">Watch it happen live.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted">
            Create professional invoices in two minutes, accept online payments through
            Midtrans, and see every rupiah land the moment it arrives — no refreshing,
            no spreadsheets, no chasing.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              Start free
              <FiArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-surface-muted"
            >
              Sign in
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {['Free to start', 'IDR-native', 'No credit card needed'].map((item) => (
              <li key={item} className="inline-flex items-center gap-2">
                <FiCheckCircle className="size-4 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Product mock */}
        <HeroPreview />
      </div>
    </section>
  );
}

/** A stylized dashboard snapshot — built from tokens, no screenshots. */
function HeroPreview() {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-xl shadow-foreground/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">Total collected</p>
            <p className="font-heading text-2xl font-bold">Rp 48.250.000</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <FiTrendingUp className="size-3.5" />
            +18% this month
          </span>
        </div>

        {/* Mini bar chart */}
        <div className="mt-6 flex h-28 items-end gap-2">
          {[40, 65, 50, 80, 60, 95, 72].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-primary/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Recent rows */}
        <div className="mt-6 space-y-2">
          {[
            { name: 'Kopi Senja', amt: 'Rp 2.400.000', paid: true },
            { name: 'Batik Nusantara', amt: 'Rp 5.100.000', paid: false },
          ].map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <span className="text-sm font-medium">{row.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm tabular-nums text-muted">{row.amt}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    row.paid
                      ? 'bg-primary/10 text-primary'
                      : 'bg-surface-muted text-muted'
                  }`}
                >
                  {row.paid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "payment received" toast */}
      <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-lg shadow-foreground/10 sm:flex">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-primary">
          <FiCheckCircle className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-tight">Payment received</p>
          <p className="text-xs text-muted">Kopi Senja · just now</p>
        </div>
      </div>
    </div>
  );
}
