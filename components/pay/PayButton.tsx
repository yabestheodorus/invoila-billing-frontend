'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FiLoader, FiLock } from 'react-icons/fi';
import { formatIDR } from '@/lib/format';
import { createPaymentLink } from '@/lib/api/public';

/**
 * Starts payment for the invoice behind `token`: asks the backend
 * (`POST /invoices/pay/:token/payment-link`) for a Midtrans Snap link, then
 * hands the payer off to the hosted Snap page where they pick a method and pay.
 */
export function PayButton({ token, amount }: { token: string; amount: number }) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    try {
      const { redirect_url } = await createPaymentLink(token);
      // Redirect to Midtrans's hosted Snap page; we don't return from here.
      window.location.href = redirect_url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Could not start payment. Please try again.',
      );
      setLoading(false); // on success we navigate away, so only reset on error
    }
  }

  return (
    <button
      type="button"
      onClick={pay}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60"
    >
      {loading ? <FiLoader className="size-4 animate-spin" /> : <FiLock className="size-4" />}
      Pay {formatIDR(amount)}
    </button>
  );
}
