'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Customer } from '@/types/customer';
import { createInvoice } from '@/lib/api/invoices';
import { useInvoiceForm } from './useInvoiceForm';

import { XIcon } from './icons';
import { Stepper, STEPS } from './Stepper';
import { BillingStep } from './steps/BillingStep';
import { ItemsStep } from './steps/ItemsStep';
import { ScheduleStep } from './steps/ScheduleStep';
import { ReviewStep } from './steps/ReviewStep';
import { DraftMenu } from './DraftMenu';
import { PreviewPane, type PreviewTab } from './preview/PreviewPane';
import { addDaysISO, customerToParty, DEFAULT_VALUES, todayISO, toSubmitValues } from '@/lib/invoice-utils';
import { getDraft, listDrafts, removeDraft, saveDraft, type InvoiceDraft } from '@/lib/draft-store';
import type { InvoiceDetail, Party } from '@/types/invoice';
import { invoiceSchema, type InvoiceFormValues } from '@/types/invoice-form';

/** Top-level form keys owned by each step (for per-step validation gating). */
const STEP_TOP_FIELDS: Record<number, string[]> = {
  0: ['from', 'to', 'meta'],
  1: ['items', 'discountPct', 'notes'],
  2: ['schedule'],
  3: ['cc', 'message'],
};

/** Does the given step have any zod validation errors in the current values? */
function stepHasErrors(stepIndex: number, values: InvoiceFormValues): boolean {
  const result = invoiceSchema.safeParse(values);
  if (result.success) return false;
  const fields = STEP_TOP_FIELDS[stepIndex] ?? [];
  return result.error.issues.some((issue) => fields.includes(String(issue.path[0])));
}

/** Leaf field names of a step — used to reveal (touch) errors on a blocked Continue. */
function stepLeafNames(stepIndex: number, values: InvoiceFormValues): string[] {
  if (stepIndex === 0) {
    return [
      'to.name', 'to.email', 'to.line1', 'to.line2', 'to.city', 'to.postal', 'to.country',
      'meta.issued', 'meta.dueDate',
    ];
  }
  if (stepIndex === 1) {
    return [
      ...values.items.flatMap((_, i) => [
        `items[${i}].description`,
        `items[${i}].qty`,
        `items[${i}].price`,
      ]),
      'discountPct',
      'notes',
    ];
  }
  if (stepIndex === 2) {
    const terms = values.schedule.terms ?? [];
    return [
      'schedule.terms',
      ...terms.flatMap((_, i) => [`schedule.terms[${i}].label`, `schedule.terms[${i}].amount`]),
    ];
  }
  return ['cc', 'message'];
}

/**
 * Create-invoice screen (Acctual-style, inline page content — no modal).
 * Left: a 3-step form (Billing → Items → Review & send) built on **TanStack
 * Form** with **zod** validation. Right: a live Invoice/Email preview driven by
 * form state. Currency is IDR. UI skeleton — submit is a no-op.
 *
 * This component owns form + step/tab state + layout only; each step and
 * preview lives in its own file under `steps/` and `preview/`.
 */
export function CreateInvoicePanel({
  customers,
  fromParty,
}: {
  customers: Customer[];
  fromParty?: Party | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [tab, setTab] = useState<PreviewTab>('invoice');

  // Drafts (localStorage via draft-store). `draftId` tracks the draft currently
  // being edited; a ref mirrors it so the stable submit callback sees the latest.
  const [drafts, setDrafts] = useState<InvoiceDraft[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const draftIdRef = useRef<string | null>(null);
  const setCurrentDraft = (id: string | null) => {
    draftIdRef.current = id;
    setDraftId(id);
  };

  // Load drafts on mount. Must be an effect (not a lazy initializer): localStorage
  // is client-only, and reading it during render would mismatch the SSR'd draft count.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrafts(listDrafts());
  }, []);

  // "From" = the saved business profile (falls back to the placeholder). "Bill
  // to" defaults to the first saved customer (with its id), when there is one.
  const initialValues: InvoiceFormValues = {
    ...DEFAULT_VALUES,
    // Computed per render (not frozen at module load): issued today, due in 20 days.
    meta: { issued: todayISO(), dueDate: addDaysISO(20) },
    from: fromParty ?? DEFAULT_VALUES.from,
    // ...(customers[0]
    //   ? { to: customerToParty(customers[0]), customerId: customers[0].id }
    //   : {}),

      ...{},
  };
  const form = useInvoiceForm(
    initialValues,
    async (values) => {
      try {
        await createInvoice(toSubmitValues(values));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to create invoice.');
        return;
      }

      // Created on the backend → drop the local draft and leave the page.
      const id = draftIdRef.current;
      if (id) {
        removeDraft(id);
        setCurrentDraft(null);
        setDrafts(listDrafts());
      }
      toast.success('Invoice created and sent.');
      router.push('/invoices');
    },
  );

  /** Save (or update) the current form values as a draft. */
  const handleSaveDraft = () => {
    const draft = saveDraft(form.state.values, draftIdRef.current ?? undefined);
    setCurrentDraft(draft.id);
    setDrafts(listDrafts());
    toast.success('Draft saved');
  };

  /** Load a draft into the form and jump back to the first step. */
  const handleResumeDraft = (id: string) => {
    const draft = getDraft(id);
    if (!draft) return;
    form.reset(draft.values);
    setCurrentDraft(id);
    setStep(0);
    toast.success('Draft loaded');
  };

  const handleDeleteDraft = (id: string) => {
    removeDraft(id);
    setDrafts(listDrafts());
    if (draftIdRef.current === id) setCurrentDraft(null);
  };

  const isLast = step === STEPS.length - 1;

  /** Advance only when the current step passes validation; else reveal errors. */
  const goNext = async () => {
    const values = form.state.values;
    if (stepHasErrors(step, values)) {
      await form.validateAllFields('change');
      for (const name of stepLeafNames(step, values)) {
        form.setFieldMeta(name as Parameters<typeof form.setFieldMeta>[0], (m) => ({
          ...m,
          isTouched: true,
        }));
      }
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  /** Stepper clicks: go back freely; advance only via the gated `goNext`. */
  const jumpTo = (target: number) => {
    if (target <= step) setStep(target);
    else if (target === step + 1) void goNext();
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface text-foreground shadow-sm">
        <div className="flex flex-col lg:flex-row">
          {/* ── Left: form ─────────────────────────────────── */}
          <div className="flex flex-col lg:w-[44%]">
            <header className="flex items-center justify-between border-b border-border px-6 py-4">
              <span className="text-sm font-medium text-muted">Create invoice</span>
              <Link href="/invoices" aria-label="Close" className="text-muted hover:text-foreground">
                <XIcon />
              </Link>
            </header>

            <div className="border-b border-border px-6 py-4">
              <Stepper step={step} onJump={jumpTo} />
            </div>

            <div className="flex-1 px-6 py-8 sm:px-8">
              {step === 0 && <BillingStep form={form} customers={customers} />}
              {step === 1 && <ItemsStep form={form} />}
              {step === 2 && <ScheduleStep form={form} />}
              {step === 3 && <ReviewStep form={form} />}
            </div>

            <footer className="flex items-center justify-between border-t border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
                >
                  {draftId ? 'Update draft' : 'Save draft'}
                </button>
                <DraftMenu drafts={drafts} onResume={handleResumeDraft} onDelete={handleDeleteDraft} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  Back
                </button>
                {!isLast && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </footer>
          </div>

          {/* ── Right: live preview (driven by form state) ─── */}
          <form.Subscribe selector={(s) => s.values}>
            {(values) => (
              <PreviewPane
                tab={tab}
                onTabChange={setTab}
                data={draftInvoiceDetail(values)}
                message={values.message ?? ''}
              />
            )}
          </form.Subscribe>
        </div>
      </div>
    </div>
  );
}

/**
 * Build a *draft* invoice-detail from live form values, so the create preview
 * renders through the exact same `InvoiceDetail` shape the API returns (no
 * separate preview DTO). The `invoice` block is a placeholder — there's no
 * persisted invoice yet, so it carries empty/neutral values and an empty number
 * (which the document shows as "Draft").
 */
function draftInvoiceDetail(v: InvoiceFormValues): InvoiceDetail {
  const subtotal = v.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const discountAmount = Math.round((subtotal * v.discountPct) / 100);
  const total = subtotal - discountAmount;
  return {
    invoice: {
      id: '',
      invoiceNumber: '',
      payToken: '',
      customerName: v.to.name,
      customerEmail: v.to.email,
      amount: total,
      description: v.items[0]?.description ?? '',
      status: 'pending',
      dueDate: v.meta.dueDate,
      createdAt: v.meta.issued,
      paidAt: null,
      emailSentAt: null,
      emailReceivedAt: null,
      emailReadAt: null,
      emailClickedAt: null,
    },
    from: v.from,
    to: v.to,
    items: v.items,
    discountPct: v.discountPct,
    subtotal,
    discountAmount,
    total,
    amountDue: null,
    notes: v.notes ?? '',
    billingSchedule: null,
  };
}
