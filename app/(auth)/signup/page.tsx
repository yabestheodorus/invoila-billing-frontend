import type { Metadata } from 'next';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: 'Sign up · Invoila',
};

export default function SignupPage() {
  return (
    <div className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h1 className="text-xl font-semibold">Create your account</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/60">Start sending invoices in minutes.</p>
      <SignupForm />
    </div>
  );
}
