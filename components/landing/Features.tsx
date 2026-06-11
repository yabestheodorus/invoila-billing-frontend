import {
  FiActivity,
  FiBell,
  FiClock,
  FiCreditCard,
  FiEye,
  FiZap,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

type Feature = { icon: IconType; title: string; body: string };

const FEATURES: Feature[] = [
  {
    icon: FiZap,
    title: 'Invoices in two minutes',
    body: 'Pick a customer, add line items, and send a polished invoice with auto-generated numbering. No templates to fight.',
  },
  {
    icon: FiCreditCard,
    title: 'Online payments via Midtrans',
    body: 'Customers pay by bank transfer, e-wallet, or card on a hosted checkout. Connect your own merchant account.',
  },
  {
    icon: FiActivity,
    title: 'Real-time dashboard',
    body: 'Revenue, outstanding balances, and activity update the instant a payment lands — no page refresh required.',
  },
  {
    icon: FiBell,
    title: 'Instant payment alerts',
    body: 'Get notified the moment an invoice is paid, so you always know exactly where your cash flow stands.',
  },
  {
    icon: FiClock,
    title: 'Smart auto-reminders',
    body: 'Schedule reminders before and after the due date. Stop chasing customers over WhatsApp and email.',
  },
  {
    icon: FiEye,
    title: 'Invoice tracking',
    body: 'See whether a customer opened your invoice and when they clicked to pay — full visibility, end to end.',
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          Everything you need
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          From sent to settled, in one place
        </h2>
        <p className="mt-4 text-lg text-muted">
          Invoila replaces the spreadsheet, the email chasing, and the guesswork with a
          real-time view of every invoice and payment.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-surface p-6 transition hover:shadow-md hover:shadow-foreground/5"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Icon className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
