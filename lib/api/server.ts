import { cache } from 'react';
import type { ActivityEvent } from '@/types/activity';
import type { Customer } from '@/types/customer';
import type { Dashboard } from '@/types/dashboard';
import type { Invoice, InvoiceDetail, InvoiceFilter, InvoiceSummary } from '@/types/invoice';
import type { Paginated } from '@/types/pagination';
import type { Payment, PaymentDetail } from '@/types/payment';
import type { MidtransAccountView } from '@/types/midtrans-account';
import type { OnboardingStatus } from '@/types/onboarding';
import { serverFetch } from './server-fetch';

/** Default invoices-per-page; mirrors the backend default. */
export const INVOICES_PER_PAGE = 10;

/**
 * Server-side API reads (for server components). Each returns a safe fallback if
 * the user isn't authenticated or the API is unavailable.
 *
 * Note: the API serializes BigInt money and Decimal as **strings**, so numeric
 * fields below are typed as `string` and should be `Number(...)`-ed for display.
 */

export interface BusinessProfileRecord {
  id: string;
  name: string;
  email: string;
  line1: string;
  line2: string | null;
  city: string;
  postal: string | null;
  country: string;
  logoUrl: string | null;
  /** User-configurable invoice-number prefix (e.g. "INV"). */
  invoicePrefix: string;
}

export interface BillingScheduleRecord {
  id: string;
  type: 'recurring' | 'installments' | 'deposit_balance';
  total: string;
  recurRepeat: string | null;
  recurUntil: string | null;
  installmentCount: number | null;
  installmentInterval: string | null;
  createdAt: string;
}

/** Saved customers for the create-invoice picker. */
export function getCustomers(): Promise<Customer[]> {
  return serverFetch<Customer[]>('/customers', []);
}

/**
 * The whole dashboard in one request: metrics + recent invoices + recent
 * activity. Falls back to an empty dashboard if unauthenticated / API down.
 */
export const getDashboard = cache((): Promise<Dashboard> => {
  return serverFetch<Dashboard>('/dashboard', {
    summary: {
      totalCollected: 0,
      paymentsReceived: 0,
      pendingAmount: 0,
      pendingCount: 0,
      overdueAmount: 0,
      overdueCount: 0,
      invoicesTotal: 0,
    },
    recentInvoices: [],
    recentActivity: [],
  });
});

/**
 * A page of the user's invoices (newest first), already shaped for the table,
 * with pagination metadata. Filtering by derived `status` happens server-side.
 */
export const getInvoices = cache(
  (params: {
    page: number;
    limit: number;
    status: InvoiceFilter;
  }): Promise<Paginated<Invoice>> => {
    const qs = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
    });
    if (params.status !== 'all') qs.set('status', params.status);
    return serverFetch<Paginated<Invoice>>(`/invoices?${qs.toString()}`, {
      data: [],
      pagination: {
        page: params.page,
        limit: params.limit,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  },
);

/** Aggregates across all the user's invoices, for the summary cards. */
export const getInvoiceSummary = cache((): Promise<InvoiceSummary> => {
  return serverFetch<InvoiceSummary>('/invoices/summary', {
    outstandingAmount: 0,
    unpaidCount: 0,
    paidAmount: 0,
    paidCount: 0,
    overdueAmount: 0,
    overdueCount: 0,
  });
});

/** Full invoice detail read model, or null if not found / unauthorized. */
export const getInvoiceDetail = cache((id: string): Promise<InvoiceDetail | null> => {
  return serverFetch<InvoiceDetail | null>(`/invoices/${id}`, null);
});

/**
 * The user's invoice activity feed (newest first), already shaped for the feed
 * components. `cache`d so the dashboard + activity page share one API hit.
 */
export const getActivities = cache((): Promise<ActivityEvent[]> => {
  return serverFetch<ActivityEvent[]>('/activities', []);
});

/** The user's payments (newest first), already shaped for the payments table. */
export const getPayments = cache((): Promise<Payment[]> => {
  return serverFetch<Payment[]>('/payments', []);
});

/** Full Midtrans detail for one payment, or null if not found / unauthorized. */
export const getPaymentDetail = cache((id: string): Promise<PaymentDetail | null> => {
  return serverFetch<PaymentDetail | null>(`/payments/${id}`, null);
});

/** The user's business profile (invoice "From"), or null if not set up yet. */
export function getBusinessProfile(): Promise<BusinessProfileRecord | null> {
  return serverFetch<BusinessProfileRecord | null>('/business-profile', null);
}

/** The user's Midtrans connection (masked), or null if not connected yet. */
export function getMidtransAccount(): Promise<MidtransAccountView | null> {
  return serverFetch<MidtransAccountView | null>('/midtrans-account', null);
}

/**
 * Onboarding-checklist completion, derived from existing reads. The `webhook`
 * step can't be detected (it's configured in the user's Midtrans dashboard), so
 * it's always `false` here and confirmed client-side (localStorage).
 */
export const getOnboardingStatus = cache(async (): Promise<OnboardingStatus> => {
  const [profile, midtrans, customers, summary] = await Promise.all([
    getBusinessProfile(),
    getMidtransAccount(),
    getCustomers(),
    getInvoiceSummary(),
  ]);
  return {
    'business-profile': profile != null,
    // Manual steps (registering Midtrans, setting the webhook) can't be detected
    // server-side — they're confirmed client-side via localStorage.
    'midtrans-register': false,
    'midtrans-account': midtrans != null,
    webhook: false,
    customer: customers.length > 0,
    invoice: summary.paidCount + summary.unpaidCount > 0,
  };
});

/** The user's billing schedules. */
export function getBillingSchedules(): Promise<BillingScheduleRecord[]> {
  return serverFetch<BillingScheduleRecord[]>('/billing-schedules', []);
}
