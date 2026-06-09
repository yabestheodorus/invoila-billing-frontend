'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiCheckCircle } from 'react-icons/fi';
import { saveMidtransAccount } from '@/lib/api/midtrans-account';
import type {
  MidtransAccountView,
  MidtransEnvironment,
} from '@/types/midtrans-account';
import { Field, buttonClass, labelClass } from './form-ui';

/**
 * Settings — connect the user's own Midtrans merchant so payments settle to
 * their account (not a shared platform account). The server key is write-only:
 * we show whether one is stored, but never its value, and require re-entering it
 * on every save (it's re-validated against Midtrans).
 */
export function MidtransAccountForm({
  initialAccount,
}: {
  initialAccount: MidtransAccountView | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    merchantId: initialAccount?.merchantId ?? '',
    clientKey: initialAccount?.clientKey ?? '',
    serverKey: '',
    environment: (initialAccount?.environment ?? 'sandbox') as MidtransEnvironment,
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveMidtransAccount({
        merchantId: form.merchantId.trim(),
        clientKey: form.clientKey.trim(),
        serverKey: form.serverKey.trim(),
        environment: form.environment,
      });
      toast.success('Midtrans account connected.');
      setForm((f) => ({ ...f, serverKey: '' })); // don't keep the secret in state
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save Midtrans account.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="rounded-xl border border-border p-6">
        <h2 className="text-base font-semibold">Payment gateway (Midtrans)</h2>
        <p className="mb-5 mt-1 text-sm text-muted">
          Connect your own Midtrans merchant so customer payments settle directly
          to your account. Find these under Midtrans Dashboard → Settings → Access
          Keys.
        </p>

        {initialAccount?.serverKeyConfigured && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800 ring-1 ring-inset ring-emerald-200">
            <FiCheckCircle className="size-4 shrink-0" />
            <span>
              Connected ({initialAccount.environment}) · server key{' '}
              {initialAccount.serverKeyMasked}
            </span>
          </div>
        )}

        <div className="space-y-4">
          {/* Environment toggle — cannot be inferred from the keys, so it's explicit. */}
          <div className="space-y-1.5">
            <span className={labelClass}>Environment</span>
            <div className="flex gap-2">
              {(['sandbox', 'production'] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => set('environment')(env)}
                  className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition ${
                    form.environment === env
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border text-muted hover:text-foreground'
                  }`}
                >
                  {env}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Merchant ID"
            value={form.merchantId}
            onChange={set('merchantId')}
            required
            placeholder="G123456789"
          />
          <Field
            label="Client Key"
            value={form.clientKey}
            onChange={set('clientKey')}
            required
            placeholder="Mid-client-xxxxxxxx"
          />
          <Field
            label="Server Key"
            value={form.serverKey}
            onChange={set('serverKey')}
            required
            placeholder={
              initialAccount?.serverKeyConfigured
                ? 'Re-enter to update'
                : 'Mid-server-xxxxxxxx'
            }
            hint="Stored encrypted. Re-enter your server key each time you save — it's re-verified with Midtrans."
          />
        </div>
      </section>

      <button type="submit" disabled={saving} className={buttonClass}>
        {saving ? 'Saving…' : 'Save Midtrans account'}
      </button>
    </form>
  );
}
