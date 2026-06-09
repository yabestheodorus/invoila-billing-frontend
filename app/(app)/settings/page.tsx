import type { Metadata } from 'next';
import { SettingsForm } from '@/components/settings/SettingsForm';
import { MidtransAccountForm } from '@/components/settings/MidtransAccountForm';
import { getBusinessProfile, getMidtransAccount } from '@/lib/api/server';

export const metadata: Metadata = {
  title: 'Settings · Invoila',
};

export default async function SettingsPage() {
  const [profile, midtransAccount] = await Promise.all([
    getBusinessProfile(),
    getMidtransAccount(),
  ]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <SettingsForm initialProfile={profile} />
      <MidtransAccountForm initialAccount={midtransAccount} />
    </div>
  );
}
