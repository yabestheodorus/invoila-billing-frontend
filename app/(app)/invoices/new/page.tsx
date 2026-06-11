import type { Metadata } from 'next';
import { CreateInvoicePanel } from '@/components/invoices/create/CreateInvoicePanel';
import { getBusinessProfile, getCustomers } from '@/lib/api/server';
import type { Party } from '@/types/invoice';

export const metadata: Metadata = {
  title: 'Create invoice · Invoila',
};

export default async function NewInvoicePage() {
  const [customers, profile] = await Promise.all([getCustomers(), getBusinessProfile()]);

  // Business profile → invoice "From" party (null when not set up yet).
  const fromParty: Party | null = profile
    ? {
        name: profile.name,
        email: profile.email,
        line1: profile.line1,
        line2: profile.line2 ?? '',
        city: profile.city,
        postal: profile.postal ?? '',
        country: profile.country,
        logoUrl: profile.logoUrl ?? undefined,
      }
    : null;

  return <CreateInvoicePanel customers={customers} fromParty={fromParty} />;
}
