const STEPS = [
  {
    step: '01',
    title: 'Create',
    body: 'Add your business profile and customers, then build an invoice with line items, discounts, and flexible billing schedules.',
  },
  {
    step: '02',
    title: 'Send',
    body: 'Email a professional invoice with a secure payment link. Customers open it and pay online — no account needed.',
  },
  {
    step: '03',
    title: 'Get paid',
    body: 'Midtrans handles bank transfer, e-wallet, and card payments. The invoice is marked paid automatically via webhook.',
  },
  {
    step: '04',
    title: 'Track live',
    body: 'Watch revenue and activity update in real time, with reminders firing automatically until every invoice is settled.',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-surface-muted/50"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Up and running in minutes
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ step, title, body }) => (
            <div key={step} className="rounded-2xl border border-border bg-surface p-6">
              <span className="font-heading text-3xl font-bold text-primary/30">
                {step}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
