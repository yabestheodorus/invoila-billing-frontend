import { Fragment } from 'react';

export const STEPS = ['Billing', 'Items', 'Schedule', 'Review'] as const;

/** The Billing → Items → Schedule → Review step indicator on the left panel. */
export function Stepper({ step, onJump }: { step: number; onJump: (s: number) => void }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <Fragment key={label}>
            <li>
              <button type="button" onClick={() => onJump(i)} className="flex items-center gap-2">
                <span
                  className={[
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : done
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-surface-muted text-muted',
                  ].join(' ')}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className={[
                    'text-sm font-medium',
                    active || done ? 'text-foreground' : 'text-muted',
                  ].join(' ')}
                >
                  {label}
                </span>
              </button>
            </li>
            {i < STEPS.length - 1 && <li className="h-px w-6 bg-border" />}
          </Fragment>
        );
      })}
    </ol>
  );
}
