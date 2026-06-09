'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ONBOARDING_STEPS,
  firstIncompleteStep,
  manualStepKey,
  onboardingProgress,
  readManualStatus,
} from '@/lib/onboarding';
import type { OnboardingStatus, OnboardingStepId } from '@/types/onboarding';
import { OnboardingChecklist } from './OnboardingChecklist';
import { OnboardingGuide } from './OnboardingGuide';

/**
 * The /onboarding page body: guide on the left (wide), checklist on the right
 * (narrow). `baseStatus` is server-derived; manual steps (register Midtrans, set
 * the webhook) are confirmed here and remembered in localStorage.
 */
export function OnboardingView({
  baseStatus,
  initialStep,
  environment = 'sandbox',
}: {
  baseStatus: OnboardingStatus;
  initialStep?: OnboardingStepId;
  /** The connected Midtrans environment — picks sandbox vs production dashboard links. */
  environment?: 'sandbox' | 'production';
}) {
  const [manual, setManual] = useState<Partial<Record<OnboardingStepId, boolean>>>({});
  const [selectedId, setSelectedId] = useState<OnboardingStepId>(
    initialStep ?? 'business-profile',
  );

  // Read manual confirmations after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setManual(readManualStatus());
  }, []);

  const status = useMemo<OnboardingStatus>(
    () => ({ ...baseStatus, ...manual }),
    [baseStatus, manual],
  );

  // Once we know the real status, land on the first unfinished step if the URL
  // didn't request one.
  useEffect(() => {
    if (!initialStep) setSelectedId(firstIncompleteStep(status));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manual]);

  const toggleManual = (id: OnboardingStepId) => (next: boolean) => {
    setManual((m) => ({ ...m, [id]: next }));
    localStorage.setItem(manualStepKey(id), next ? '1' : '0');
  };

  const selected =
    ONBOARDING_STEPS.find((s) => s.id === selectedId) ?? ONBOARDING_STEPS[0];
  const { done, total, complete } = onboardingProgress(status);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Get started</h1>
        <p className="mt-1 text-sm text-muted">
          {complete
            ? 'You’re all set — every step is done. 🎉'
            : `Finish setting up Invoila — ${done} of ${total} done.`}
        </p>
      </div>

      {/* Guide (wide) on the left, checklist (narrow) on the right. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <section className="order-2 rounded-xl border border-border p-6 lg:order-1">
          <OnboardingGuide
            step={selected}
            done={status[selected.id]}
            environment={environment}
            onToggleManual={selected.manual ? toggleManual(selected.id) : undefined}
          />
        </section>

        <aside className="order-1 lg:order-2">
          <div className="rounded-xl border border-border p-4 lg:sticky lg:top-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                Checklist
              </p>
              <span className="text-xs font-medium text-muted">
                {done}/{total}
              </span>
            </div>
            {/* Progress bar */}
            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
            <OnboardingChecklist
              status={status}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
