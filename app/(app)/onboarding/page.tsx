import type { Metadata } from 'next';
import { getMidtransAccount, getOnboardingStatus } from '@/lib/api/server';
import { ONBOARDING_STEPS } from '@/lib/onboarding';
import type { OnboardingStepId } from '@/types/onboarding';
import { OnboardingView } from '@/components/onboarding/OnboardingView';

export const metadata: Metadata = {
  title: 'Get started · Invoila',
};

export default async function OnboardingPage({
  searchParams,
}: {
  // Next 16: searchParams is an async Promise.
  searchParams: Promise<{ step?: string }>;
}) {
  // `getMidtransAccount` is React-`cache`d and already called inside
  // `getOnboardingStatus`, so this doesn't cost a second request.
  const [{ step }, baseStatus, account] = await Promise.all([
    searchParams,
    getOnboardingStatus(),
    getMidtransAccount(),
  ]);

  const initialStep = ONBOARDING_STEPS.some((s) => s.id === step)
    ? (step as OnboardingStepId)
    : undefined;

  return (
    <div className="mx-auto max-w-5xl">
      <OnboardingView
        baseStatus={baseStatus}
        initialStep={initialStep}
        environment={account?.environment ?? 'sandbox'}
      />
    </div>
  );
}
