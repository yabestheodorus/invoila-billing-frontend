import type { InvoiceSubmitValues } from '@/types/invoice-form';
import { browserFetch } from './browser-fetch';

/** The backend's created-invoice response (only the fields we use here). */
export interface CreatedInvoice {
  id: string;
  invoiceNumber: string;
}

/**
 * POST a new invoice to the backend. The payload shape matches the backend
 * `invoiceSchema` (same Zod schema as the create form), including the optional
 * `customerId`.
 */
export function createInvoice(values: InvoiceSubmitValues): Promise<CreatedInvoice> {
  return browserFetch<CreatedInvoice>('/invoices', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

/** Result of emailing an invoice to its customer. */
export interface SendInvoiceEmailResult {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  recipient: string;
}

/** Email an invoice to its billed-to customer (backend renders + sends via Resend). */
export function sendInvoiceEmail(id: string): Promise<SendInvoiceEmailResult> {
  return browserFetch<SendInvoiceEmailResult>(`/invoices/${id}/send-email`, {
    method: 'POST',
  });
}
