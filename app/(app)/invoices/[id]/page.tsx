import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { InvoiceDetail } from '@/components/invoices/InvoiceDetail';
import { getInvoiceDetail } from '@/lib/api/server';
import { getInvoiceTimeline } from '@/lib/invoice-utils';

// Note: in Next.js 16, `params` is a Promise and must be awaited.
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await getInvoiceDetail(id);
  return {
    title: detail ? `${detail.invoice.invoiceNumber} · Invoila` : 'Invoice not found · Invoila',
  };
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  const detail = await getInvoiceDetail(id);

  if (!detail) {
    notFound();
  }

  const timeline = getInvoiceTimeline(detail.invoice);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link href="/invoices" className="text-sm text-foreground/60 hover:underline">
        ← Back to invoices
      </Link>
      <InvoiceDetail detail={detail} timeline={timeline} />
    </div>
  );
}
