import Link from 'next/link';
import { FiCheck } from 'react-icons/fi';

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: 'Free',
    price: 'Rp 0',
    period: 'forever',
    description: 'Everything a solo owner needs to start getting paid online.',
    features: [
      'Up to 10 invoices / month',
      'Online payments via Midtrans',
      'Real-time payment dashboard',
      'Customer management',
    ],
    cta: 'Start free',
  },
  {
    name: 'Premium',
    price: 'Rp 149.000',
    period: 'per month',
    description: 'For growing businesses that bill regularly and need automation.',
    features: [
      'Unlimited invoices',
      'Automatic payment reminders',
      'Recurring & installment billing',
      'Invoice open & click tracking',
      'Priority support',
    ],
    cta: 'Start free trial',
    featured: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          Pricing
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Simple, honest pricing
        </h2>
        <p className="mt-4 text-lg text-muted">
          Start for free and upgrade when you&apos;re ready. No setup fees, cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl border p-8 ${
              plan.featured
                ? 'border-primary bg-surface shadow-lg shadow-primary/10'
                : 'border-border bg-surface'
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Most popular
              </span>
            )}

            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="font-heading text-4xl font-bold tracking-tight">
                {plan.price}
              </span>
              <span className="text-sm text-muted">/ {plan.period}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{plan.description}</p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <FiCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className={`mt-8 block rounded-md px-4 py-2.5 text-center text-sm font-semibold transition ${
                plan.featured
                  ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                  : 'border border-border text-foreground hover:bg-surface-muted'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
