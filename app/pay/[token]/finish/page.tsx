import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { getPayInvoice, syncPayInvoice } from '@/lib/api/public';
import { formatIDR } from '@/lib/format';

export const metadata: Metadata = { title: 'Payment status · Invoila' };

type Props = {
  params: Promise<{ token: string }>;
  // Midtrans appends these to the finish redirect URL.
  searchParams: Promise<{ transaction_status?: string; status_code?: string }>;
};

type View = { icon: IconType; tone: string; title: string; message: string };

/**
 * Where Snap returns the payer after the hosted checkout. This is UX only — the
 * authoritative status comes from the server-to-server webhook, so we trust the
 * invoice's own `status` first and fall back to the redirect's `transaction_status`
 * (the webhook may not have landed yet when the browser arrives here).
 */
function resolveView(invoicePaid: boolean, txStatus?: string): View {
  if (invoicePaid || txStatus === 'settlement' || txStatus === 'capture') {
    return {
      icon: FiCheckCircle,
      tone: 'text-emerald-600',
      title: 'Payment successful',
      message: 'Thank you — your payment has been received.',
    };
  }
  if (txStatus === 'pending') {
    return {
      icon: FiClock,
      tone: 'text-amber-500',
      title: 'Payment pending',
      message:
        'We’re waiting for your payment to be confirmed. Once it clears, this invoice updates automatically.',
    };
  }
  return {
    icon: FiXCircle,
    tone: 'text-red-500',
    title: 'Payment not completed',
    message: 'Your payment wasn’t completed. You can head back and try again.',
  };
}

export default async function PaymentFinishPage({ params, searchParams }: Props) {
  const { token } = await params;
  const { transaction_status } = await searchParams;

  // The payer just returned from checkout — reconcile with Midtrans so the
  // invoice reflects the payment even if the webhook hasn't landed yet.
  const invoice = (await syncPayInvoice(token)) ?? (await getPayInvoice(token));
  if (!invoice) {
    notFound();
  }

  const view = resolveView(invoice.status === 'paid', transaction_status);
  const Icon = view.icon;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: 'radial-gradient(55% 60% at 50% 0%, rgba(217,119,87,0.16), transparent)' }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-12">
        <div className="mb-6 flex items-center gap-2">
          <Image src="/favicon.png" alt="Invoila" width={32} height={32} className="rounded-lg" />
          <span className="font-heading text-lg font-semibold">Invoila</span>
        </div>

        <div className="w-full rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
          <Icon className={`mx-auto size-14 ${view.tone}`} />
          <h1 className="mt-4 font-heading text-2xl font-bold">{view.title}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{view.message}</p>

          <div className="mt-6 rounded-xl border border-border px-5 py-4 text-left">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Invoice</span>
              <span className="font-medium">#{invoice.invoiceNumber}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted">Amount</span>
              <span className="font-semibold tabular-nums">{formatIDR(invoice.amount)}</span>
            </div>
          </div>

          <Link
            href={`/pay/${token}`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
          >
            Back to invoice
          </Link>
        </div>
      </div>
    </main>
  );
}
