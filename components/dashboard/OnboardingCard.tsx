'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { onboardingProgress, readManualStatus } from '@/lib/onboarding';
import type { OnboardingStatus, OnboardingStepId } from '@/types/onboarding';
import { OnboardingChecklist } from '@/components/onboarding/OnboardingChecklist';

/**
 * Dashboard "Get started" card. Shows the checklist (server-derived, plus the
 * client-confirmed manual steps) and links each item to the full /onboarding
 * guide. Hides itself once everything is done.
 */
export function OnboardingCard({ baseStatus }: { baseStatus: OnboardingStatus }) {
  const [manual, setManual] = useState<Partial<Record<OnboardingStepId, boolean>>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setManual(readManualStatus());
    setMounted(true);
  }, []);

  const status: OnboardingStatus = { ...baseStatus, ...manual };
  const { done, total, complete } = onboardingProgress(status);

  // Don't flash the card before we've read the manual flags, and hide it once
  // onboarding is finished.
  if (!mounted || complete) return null;

  return (
    <section className="rounded-2xl border border-border bg-surface-muted p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-base font-semibold">Get started with Invoila</h3>
          <p className="mt-1 text-sm text-muted">
            {done} of {total} steps done — finish setup to start getting paid.
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Open guide <FiArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-4">
        <OnboardingChecklist status={status} />
      </div>
    </section>
  );
}
