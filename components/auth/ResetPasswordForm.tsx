import Link from 'next/link';
import { inputClass, labelClass } from './form-styles';

/** Reset-password form — UI skeleton only, not wired to anything yet. */
export function ResetPasswordForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="password" className={labelClass}>
          New password
        </label>
        <input id="password" name="password" type="password" className={inputClass} />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className={labelClass}>
          Confirm new password
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" className={inputClass} />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Reset password
      </button>
      <p className="text-center text-sm text-foreground/60">
        <Link href="/login" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
