import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot password · Invoila',
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h1 className="text-xl font-semibold">Forgot your password?</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/60">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
