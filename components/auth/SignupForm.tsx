'use client'

import Link from 'next/link';
import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { SignUpFormType, signupSchema } from '@/types/auth';
import { TextField } from '@/components/shared/form-fields';
import { useRouter } from 'next/navigation';


/** Sign-up form. */
export function SignupForm() {

  const supabase = createClient()
  const router = useRouter();
  const handleSubmit = async (data: SignUpFormType) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      // Supabase may return a session before the email is confirmed; that token
      // is accepted by the API but the account isn't really usable yet. Clear it
      // so the user can't land in the app half-authenticated, then send them to
      // the "confirm your email" page.
      await supabase.auth.signOut();
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  const form = useForm(
    {
      defaultValues: { email: '', password: '', confirmPassword: '' },
      validators: { onChange: signupSchema },
      onSubmit: async ({ value }) => handleSubmit(value),
    }
  )



  return (
    <form className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >


      <form.Field name='email'>
        {(field) => (
          <TextField field={field} label="Email" type='email' isRequired={true} />
        )}

      </form.Field>

      <form.Field name='password'>
        {(field) => (
          <TextField field={field} label="Password" type='password' isRequired={true} />
        )}

      </form.Field>
      <form.Field name='confirmPassword'>
        {(field) => (
          <TextField field={field} label="Confirm password" type='password' isRequired={true} />
        )}

      </form.Field>




      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
      >
        Create account
      </button>
      <p className="text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
