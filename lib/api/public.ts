import { cache } from 'react';
import type { Invoice } from '@/types/invoice';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Unauthenticated API reads for public pages (the customer pay page). Unlike
 * `serverFetch`, these send no Supabase token — the payer follows a shared link
 * and isn't signed in. Returns null on any failure so the page can 404 cleanly.
 */
export const getPayInvoice = cache(async (token: string): Promise<Invoice | null> => {
  try {
    const res = await fetch(`${API_URL}/invoices/pay/${token}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Invoice;
  } catch {
    return null;
  }
});

/**
 * Reconcile the invoice with Midtrans (re-queries the transaction status and
 * marks it paid if it settled), then return the fresh invoice. Use this where a
 * payment may have just completed (the pay/finish pages) so the UI reflects it
 * even if the async webhook hasn't reached us. Returns null on any failure so
 * the caller can fall back to {@link getPayInvoice}.
 */
export async function syncPayInvoice(token: string): Promise<Invoice | null> {
  try {
    const res = await fetch(`${API_URL}/payments/sync/${token}`, {
      method: 'POST',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as Invoice;
  } catch {
    return null;
  }
}

/** A created Midtrans Snap transaction: the hosted pay URL plus its token. */
export interface PaymentLink {
  token: string;
  /** Midtrans-hosted Snap page to send the payer to. */
  redirect_url: string;
}

/**
 * Create a Midtrans Snap payment link for the invoice behind `token` (public
 * pay page — no auth). Unlike {@link getPayInvoice}, this throws a readable
 * error on failure so the caller can surface it to the payer.
 */
export async function createPaymentLink(token: string): Promise<PaymentLink> {
  const res = await fetch(`${API_URL}/invoices/pay/${token}/payment-link`, {
    method: 'POST',
    cache: 'no-store',
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      message = ((await res.json()) as { message?: string }).message ?? message;
    } catch {
      /* error body wasn't JSON */
    }
    throw new Error(message);
  }
  return (await res.json()) as PaymentLink;
}
