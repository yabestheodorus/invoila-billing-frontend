import type {
  OnboardingStepId,
  OnboardingStepMeta,
  OnboardingStatus,
} from '@/types/onboarding';

/**
 * The get-started checklist, in order. Metadata only (no JSX — guide bodies live
 * in `components/onboarding/`, per the types/lib/components split).
 */
export const ONBOARDING_STEPS: OnboardingStepMeta[] = [
  {
    id: 'business-profile',
    title: 'Set up your business profile',
    summary: 'Your name, address and invoice prefix — the “From” on every invoice.',
    cta: { label: 'Open business profile', href: '/settings' },
  },
  {
    id: 'midtrans-register',
    title: 'Register a Midtrans account',
    summary: 'Create your Midtrans merchant account so you can accept payments.',
    manual: true,
  },
  {
    id: 'midtrans-account',
    title: 'Connect your Midtrans account',
    summary: 'Add your merchant ID and keys so payments settle to your own account.',
    cta: { label: 'Connect Midtrans', href: '/settings' },
  },
  {
    id: 'webhook',
    title: 'Set your Midtrans payment notification URL',
    summary: 'Point Midtrans back at Invoila so paid invoices update automatically.',
    manual: true,
  },
  {
    id: 'customer',
    title: 'Add your first customer',
    summary: 'Save who you bill so invoices auto-fill their details.',
    cta: { label: 'Add a customer', href: '/customers' },
  },
  {
    id: 'invoice',
    title: 'Create your first invoice',
    summary: 'Send a branded invoice with a built-in payment link.',
    cta: { label: 'Create invoice', href: '/invoices/new' },
  },
];

/** Steps that can't be detected from data — the user confirms them manually. */
export const MANUAL_STEP_IDS: OnboardingStepId[] = ONBOARDING_STEPS.filter(
  (s) => s.manual,
).map((s) => s.id);

/** localStorage key remembering a manually-confirmed step. */
export function manualStepKey(id: OnboardingStepId): string {
  return `invoila.onboarding.${id}`;
}

/**
 * Read every manual step's confirmation from localStorage (client only; returns
 * `{}` on the server). Overlaid on the server-derived status.
 */
export function readManualStatus(): Partial<Record<OnboardingStepId, boolean>> {
  if (typeof window === 'undefined') return {};
  const out: Partial<Record<OnboardingStepId, boolean>> = {};
  for (const id of MANUAL_STEP_IDS) {
    out[id] = localStorage.getItem(manualStepKey(id)) === '1';
  }
  return out;
}

/** The Midtrans merchant sign-up page. */
export const MIDTRANS_REGISTER_URL = 'https://dashboard.midtrans.com/register';

/** The Payment Notification URL a user pastes into their Midtrans dashboard. */
export function webhookUrl(): string {
  const api = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return `${api}/payments/notification`;
}

/** Midtrans dashboard base per environment (sandbox vs production differ). */
export const MIDTRANS_DASHBOARD_BASE: Record<'sandbox' | 'production', string> = {
  sandbox: 'https://dashboard.sandbox.midtrans.com',
  production: 'https://dashboard.midtrans.com',
};

/** Deep links to the exact Midtrans dashboard pages used during setup. */
export function midtransDashboardLinks(env: 'sandbox' | 'production') {
  const base = MIDTRANS_DASHBOARD_BASE[env];
  return {
    accessKeys: `${base}/settings/access-keys`,
    finishRedirect: `${base}/settings/payment/finish-redirect`,
    notification: `${base}/settings/payment/notification`,
  };
}

/** Completed / total + overall progress for the checklist. */
export function onboardingProgress(status: OnboardingStatus) {
  const done = ONBOARDING_STEPS.filter((s) => status[s.id]).length;
  const total = ONBOARDING_STEPS.length;
  return { done, total, complete: done === total };
}

/** First step that still needs doing (for a sensible default selection). */
export function firstIncompleteStep(status: OnboardingStatus): OnboardingStepId {
  return (ONBOARDING_STEPS.find((s) => !status[s.id]) ?? ONBOARDING_STEPS[0]).id;
}
