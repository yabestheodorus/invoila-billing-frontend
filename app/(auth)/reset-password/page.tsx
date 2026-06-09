import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset password · Invoila',
};

export default function ResetPasswordPage() {
  return (
    <div className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h1 className="text-xl font-semibold">Set a new password</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/60">
        Choose a strong password for your account.
      </p>
      <ResetPasswordForm />
    </div>
  );
}
