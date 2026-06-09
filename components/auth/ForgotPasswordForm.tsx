import Link from 'next/link';
import { inputClass, labelClass } from './form-styles';

/** Forgot-password form — UI skeleton only, not wired to anything yet. */
export function ForgotPasswordForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" className={inputClass} />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Send reset link
      </button>
      <p className="text-center text-sm text-foreground/60">
        Remembered it?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
