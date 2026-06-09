import { FiArrowRight, FiSmartphone } from 'react-icons/fi';

export function PromoCards() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Bookkeeping help */}
      <div className="rounded-2xl border border-border bg-surface-muted p-6">
        <h3 className="font-heading text-base font-semibold">Need help with bookkeeping?</h3>
        <p className="mt-1 max-w-xs text-sm text-muted">
          Connect with our local experts to help optimize your business financial flow.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Chat with Support <FiArrowRight className="size-4" />
        </button>
      </div>

      {/* Mobile access */}
      <div className="flex items-start gap-4 rounded-2xl border border-border bg-accent p-6">
        <span className="hidden size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:flex">
          <FiSmartphone className="size-7" />
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
            Mobile Access
          </p>
          <h3 className="mt-0.5 font-heading text-base font-semibold">Take Invoila everywhere</h3>
          <p className="mt-1 max-w-xs text-sm text-muted">
            Download our app for instant invoice notifications and on-the-go tracking.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            <FiSmartphone className="size-4" />
            App Store
          </button>
        </div>
      </div>
    </div>
  );
}
