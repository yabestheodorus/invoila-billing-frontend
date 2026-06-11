import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { FiShield } from 'react-icons/fi';
import { PayInvoiceCard } from '@/components/pay/PayInvoiceCard';
import { getPayInvoice, syncPayInvoice } from '@/lib/api/public';

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const detail = await getPayInvoice(token);
  return {
    title: detail
      ? `Pay ${detail.invoice.invoiceNumber} · Invoila`
      : 'Invoice not found · Invoila',
  };
}

export default async function PayInvoicePage({ params }: Props) {
  const { token } = await params;
  // Reconcile with Midtrans first (catches a payment the webhook hasn't
  // delivered), falling back to a plain read if the sync call fails.
  const detail = (await syncPayInvoice(token)) ?? (await getPayInvoice(token));

  if (!detail) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Warm glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96"
        style={{ background: 'radial-gradient(55% 60% at 50% 0%, rgba(217,119,87,0.16), transparent)' }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col items-center justify-center px-4 py-12">
        {/* Brand */}
        <div className="mb-6 flex items-center gap-2">
          <Image src="/favicon.png" alt="Invoila" width={32} height={32} className="rounded-lg" />
          <span className="font-heading text-lg font-semibold">Invoila</span>
        </div>

        <PayInvoiceCard detail={detail} />

        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted">
          <FiShield className="size-3.5" /> Payments secured by Midtrans
        </p>
      </div>
    </main>
  );
}
