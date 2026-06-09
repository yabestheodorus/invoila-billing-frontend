/** Get-started onboarding checklist — view models. */

export type OnboardingStepId =
  | 'business-profile'
  | 'midtrans-register'
  | 'midtrans-account'
  | 'webhook'
  | 'customer'
  | 'invoice';

export interface OnboardingStepMeta {
  id: OnboardingStepId;
  /** Checklist + guide heading. */
  title: string;
  /** One-line description shown under the title in the checklist. */
  summary: string;
  /** Optional primary action surfaced in the guide. */
  cta?: { label: string; href: string };
  /**
   * Steps we can't detect from data (e.g. a setting configured in Midtrans's own
   * dashboard). The user confirms these themselves; completion is remembered in
   * the browser, not derived server-side.
   */
  manual?: boolean;
}

/** Which steps are complete. Server-derived, except `webhook` (client/manual). */
export type OnboardingStatus = Record<OnboardingStepId, boolean>;
