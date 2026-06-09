import type { Metadata } from 'next';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Confirm your email · Invoila',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  // Next 16: searchParams is an async Promise.
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <div className="rounded-xl border border-black/10 p-6 text-center dark:border-white/15">
      <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-primary">
        <FiMail className="size-6" />
      </span>

      <h1 className="text-xl font-semibold">Confirm your email</h1>
      <p className="mb-6 mt-2 text-sm leading-relaxed text-foreground/60">
        We’ve sent a confirmation link
        {email ? (
          <>
            {' '}to <span className="font-medium text-foreground">{email}</span>
          </>
        ) : null}
        . Click the link in that email to activate your account, then sign in.
      </p>

      <Link
        href="/login"
        className="block w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
      >
        Go to login
      </Link>

      <p className="mt-4 text-xs text-foreground/50">
        Didn’t get the email? Check your spam folder, or{' '}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          try signing up again
        </Link>
        .
      </p>
    </div>
  );
}
