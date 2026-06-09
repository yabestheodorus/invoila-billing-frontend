import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign in · Invoila',
};

export default function LoginPage() {
  return (
    <div className="rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h1 className="text-xl font-semibold">Welcome back</h1>
      <p className="mb-6 mt-1 text-sm text-foreground/60">Sign in to your Invoila account.</p>
      <LoginForm />
    </div>
  );
}
