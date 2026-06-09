import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PaymentDetailView } from '@/components/payments/PaymentDetailView';
import { getPaymentDetail } from '@/lib/api/server';

// Note: in Next.js 16, `params` is a Promise and must be awaited.
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const payment = await getPaymentDetail(id);
  return {
    title: payment
      ? `Payment · ${payment.invoiceNumber} · Invoila`
      : 'Payment not found · Invoila',
  };
}

export default async function PaymentPage({ params }: Props) {
  const { id } = await params;
  const payment = await getPaymentDetail(id);

  if (!payment) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/payments" className="text-sm text-foreground/60 hover:underline">
        ← Back to payments
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payment detail</h1>
        <p className="mt-1 text-sm text-muted">
          Gateway response recorded for invoice {payment.invoiceNumber}.
        </p>
      </div>
      <PaymentDetailView detail={payment} />
    </div>
  );
}
