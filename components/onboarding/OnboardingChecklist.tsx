'use client';

import Link from 'next/link';
import { FiCheckCircle, FiChevronRight, FiCircle } from 'react-icons/fi';
import { ONBOARDING_STEPS } from '@/lib/onboarding';
import type { OnboardingStatus, OnboardingStepId } from '@/types/onboarding';

/**
 * The get-started checklist. Two modes:
 * - `onSelect` given → rows are buttons (the /onboarding page, selecting a guide).
 * - otherwise → rows are links to `/onboarding?step=<id>` (the dashboard card).
 */
export function OnboardingChecklist({
  status,
  selectedId,
  onSelect,
}: {
  status: OnboardingStatus;
  selectedId?: OnboardingStepId;
  onSelect?: (id: OnboardingStepId) => void;
}) {
  return (
    <ul className="space-y-1.5">
      {ONBOARDING_STEPS.map((step) => {
        const done = status[step.id];
        const active = selectedId === step.id;
        const inner = (
          <>
            {done ? (
              <FiCheckCircle className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            ) : (
              <FiCircle className="mt-0.5 size-4 shrink-0 text-muted" />
            )}
            <span className="min-w-0 flex-1">
              <span
                className={`block text-sm font-medium ${
                  done ? 'text-muted line-through' : 'text-foreground'
                }`}
              >
                {step.title}
              </span>
            </span>
            <FiChevronRight className="mt-0.5 size-4 shrink-0 text-muted" />
          </>
        );

        const className = `flex w-full items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition ${
          active
            ? 'border-primary bg-accent'
            : 'border-border hover:border-foreground/20 hover:bg-surface-muted'
        }`;

        return (
          <li key={step.id}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                className={className}
              >
                {inner}
              </button>
            ) : (
              <Link href={`/onboarding?step=${step.id}`} className={className}>
                {inner}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
