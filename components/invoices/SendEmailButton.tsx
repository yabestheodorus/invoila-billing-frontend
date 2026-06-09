'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FiLoader, FiSend } from 'react-icons/fi';
import { sendInvoiceEmail } from '@/lib/api/invoices';

/**
 * Emails the invoice to its customer via the backend (Resend). Shows progress,
 * toasts the outcome, and refreshes so the "sent" activity / state appears.
 */
export function SendEmailButton({ invoiceId }: { invoiceId: string }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  async function send() {
    setSending(true);
    try {
      const { recipient } = await sendInvoiceEmail(invoiceId);
      toast.success(`Invoice emailed to ${recipient}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send the email.');
    } finally {
      setSending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={send}
      disabled={sending}
      className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
    >
      {sending ? <FiLoader className="size-4 animate-spin" /> : <FiSend className="size-4" />}
      {sending ? 'Sending…' : 'Send email'}
    </button>
  );
}
