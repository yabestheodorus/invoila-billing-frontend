'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { saveBusinessProfile } from '@/lib/api/business-profile';
import type { BusinessProfileRecord } from '@/lib/api/server';
import { Field, Section, buttonClass } from './form-ui';

/** Settings — business profile (the invoice "From"). */
export function SettingsForm({ initialProfile }: { initialProfile: BusinessProfileRecord | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialProfile?.name ?? '',
    email: initialProfile?.email ?? '',
    line1: initialProfile?.line1 ?? '',
    line2: initialProfile?.line2 ?? '',
    city: initialProfile?.city ?? '',
    postal: initialProfile?.postal ?? '',
    country: initialProfile?.country ?? '',
    invoicePrefix: initialProfile?.invoicePrefix ?? 'INV',
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveBusinessProfile({
        name: form.name,
        email: form.email,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        postal: form.postal || undefined,
        country: form.country,
        invoicePrefix: form.invoicePrefix.trim() || undefined,
      });
      toast.success('Business profile saved.');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const prefixPreview = `${form.invoicePrefix.trim() || 'INV'}-0001`;

  return (
    <form onSubmit={submit} className="space-y-6">
      <Section title="Business profile" description="Used as the “From” on your invoices and emails.">
        <Field label="Business name" value={form.name} onChange={set('name')} required placeholder="Invoila Studio" />
        <Field label="Business email" type="email" value={form.email} onChange={set('email')} required />
        <Field label="Address line 1" value={form.line1} onChange={set('line1')} required />
        <Field label="Address line 2" value={form.line2} onChange={set('line2')} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="City" value={form.city} onChange={set('city')} required />
          <Field label="Postal code" value={form.postal} onChange={set('postal')} />
          <Field label="Country" value={form.country} onChange={set('country')} required />
        </div>
      </Section>

      <Section
        title="Invoicing"
        description="Invoice numbers are assigned automatically — set the prefix you want them to use."
      >
        <Field
          label="Invoice number prefix"
          value={form.invoicePrefix}
          onChange={set('invoicePrefix')}
          placeholder="INV"
        />
        <p className="text-sm text-muted">
          New invoices will be numbered <span className="font-medium text-foreground">{prefixPreview}</span>,
          then count up.
        </p>
      </Section>

      <button type="submit" disabled={saving} className={buttonClass}>
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </form>
  );
}
