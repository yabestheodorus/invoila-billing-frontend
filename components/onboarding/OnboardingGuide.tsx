'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiCopy,
  FiExternalLink,
  FiLock,
} from 'react-icons/fi';
import { MIDTRANS_REGISTER_URL, midtransDashboardLinks, webhookUrl } from '@/lib/onboarding';
import type { OnboardingStepMeta } from '@/types/onboarding';

const STEP_GUIDES: Record<
  string,
  { intro: string; steps: string[] }
> = {
  'business-profile': {
    intro:
      'Your business profile is the “From” party on every invoice and email — your name, contact and address, plus the prefix used to number invoices (e.g. INV-0001).',
    steps: [
      'Open Settings → Business profile.',
      'Fill in your business name, email and address.',
      'Pick an invoice number prefix (default “INV”).',
      'Save. New invoices will be numbered from your prefix automatically.',
    ],
  },
  customer: {
    intro:
      'Save the people and businesses you bill. Once saved, the create-invoice form auto-fills their name, email and address.',
    steps: [
      'Open the Customers page.',
      'Add a customer with their name, email and address.',
      'They’ll now appear in the “Bill to” picker when creating invoices.',
    ],
  },
  invoice: {
    intro:
      'Create a branded invoice with line items, schedule and a built-in payment link your customer can pay online.',
    steps: [
      'Click Create invoice.',
      'Pick the customer, add line items and any discount.',
      'Choose a one-time or scheduled billing plan, then review and send.',
      'Share the payment link — your customer pays via Midtrans and the invoice updates itself.',
    ],
  },
};

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy');
    }
  };
  return (
    <div>
      <p className="mb-1.5 text-[13px] font-medium">{label}</p>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2.5">
        <code className="min-w-0 flex-1 truncate font-mono text-sm">{value || '—'}</code>
        <button
          type="button"
          onClick={copy}
          disabled={!value}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition hover:text-foreground disabled:opacity-50"
        >
          {copied ? <FiCheck className="size-3.5" /> : <FiCopy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

function OrderedSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-5 space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {i + 1}
          </span>
          <span className="pt-0.5 text-sm leading-relaxed text-foreground">{s}</span>
        </li>
      ))}
    </ol>
  );
}

function DashboardLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      {children}
      <FiExternalLink className="size-3.5" />
    </a>
  );
}

/** "Mark as done / not done" toggle for manual (undetectable) steps. */
function ManualDoneButton({
  done,
  onToggle,
}: {
  done: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(!done)}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
        done
          ? 'border border-border text-muted hover:text-foreground'
          : 'bg-primary text-primary-foreground hover:bg-primary-hover'
      }`}
    >
      <FiCheck className="size-4" />
      {done ? 'Mark as not done' : 'Mark as done'}
    </button>
  );
}

/** The guide body for the selected step (left side of the onboarding page). */
export function OnboardingGuide({
  step,
  done,
  environment = 'sandbox',
  onToggleManual,
}: {
  step: OnboardingStepMeta;
  done: boolean;
  environment?: 'sandbox' | 'production';
  /** Toggle a manual step's completion (passed when `step.manual`). */
  onToggleManual?: (next: boolean) => void;
}) {
  const links = midtransDashboardLinks(environment);

  return (
    <div>
      <div className="flex items-center gap-2">
        {done && <FiCheckCircle className="size-5 text-emerald-600" />}
        <h2 className="font-heading text-xl font-semibold tracking-tight">{step.title}</h2>
      </div>

      {step.id === 'midtrans-register' ? (
        <div className="mt-4 space-y-5">
          <p className="text-sm leading-relaxed text-muted">
            Invoila uses Midtrans to process payments, so you’ll need your own Midtrans merchant
            account. It’s free to create — start in Sandbox to test, then activate Production when
            you’re ready to accept real payments.
          </p>

          <OrderedSteps
            steps={[
              'Go to the Midtrans sign-up page and create an account.',
              'Register your business and complete the verification steps.',
              'You’ll get instant Sandbox access; Production unlocks after approval.',
              'Come back and mark this step done.',
            ]}
          />

          <div>
            <DashboardLink href={MIDTRANS_REGISTER_URL}>Create a Midtrans account</DashboardLink>
          </div>

          {onToggleManual && <ManualDoneButton done={done} onToggle={onToggleManual} />}
        </div>
      ) : step.id === 'midtrans-account' ? (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-muted">
            Invoila collects payments straight into your own Midtrans merchant — not a shared
            account. Connect it once and every payment link bills your account.
          </p>

          <OrderedSteps
            steps={[
              'In your Midtrans dashboard, open Settings → Access Keys.',
              'Copy your Merchant ID, Client Key and Server Key.',
              'In Invoila, open Settings → Payment gateway (Midtrans).',
              'Choose the matching environment (Sandbox or Production), paste the keys and save — Invoila verifies them with Midtrans before storing.',
            ]}
          />

          <div className="mt-4">
            <DashboardLink href={links.accessKeys}>
              Open Midtrans Access Keys ({environment})
            </DashboardLink>
          </div>

          {/* Encryption reassurance */}
          <div className="mt-5 flex gap-3 rounded-lg border border-border bg-surface-muted p-4">
            <FiLock className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            <p className="text-sm leading-relaxed text-muted">
              <span className="font-medium text-foreground">Your keys stay secured.</span> Your Server
              Key is <strong>encrypted</strong> (AES-256) before it’s written to our database, kept
              encrypted at rest, and never sent back to your browser — Settings only ever shows a
              masked hint, never the full key.
            </p>
          </div>

          {step.cta && (
            <Link
              href={step.cta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              {step.cta.label}
              <FiArrowRight className="size-4" />
            </Link>
          )}
        </div>
      ) : step.id === 'webhook' ? (
        <div className="mt-4 space-y-5">
          <p className="text-sm leading-relaxed text-muted">
            The <strong>Payment Notification URL</strong> is what makes paid invoices update
            automatically — set it in your <strong>own</strong> Midtrans dashboard. It’s the same URL
            for every Invoila user; Invoila matches each notification to the right invoice and
            verifies it with your server key.
          </p>

          {/* Payment Notification URL — the one that actually needs setting. */}
          <div className="space-y-2">
            <CopyField label="Payment Notification URL" value={webhookUrl()} />
            <p className="text-xs text-muted">
              Settings → Payment → Notification URL.{' '}
              <DashboardLink href={links.notification}>Open in Midtrans</DashboardLink>
            </p>
          </div>

          <OrderedSteps
            steps={[
              'Open Settings → Payment in your Midtrans dashboard.',
              'Paste the Payment Notification URL into “Notification URL” and save.',
              'Set it in both Sandbox and Production as you go live, then mark this step done.',
            ]}
          />

          {onToggleManual && <ManualDoneButton done={done} onToggle={onToggleManual} />}
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-sm leading-relaxed text-muted">{STEP_GUIDES[step.id]?.intro}</p>
          <OrderedSteps steps={STEP_GUIDES[step.id]?.steps ?? []} />

          {step.cta && (
            <Link
              href={step.cta.href}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
            >
              {step.cta.label}
              <FiArrowRight className="size-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
