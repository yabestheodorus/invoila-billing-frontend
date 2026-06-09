import type { Metadata } from 'next';
import { PaymentsTable } from '@/components/payments/PaymentsTable';
import { getPayments } from '@/lib/api/server';

export const metadata: Metadata = {
  title: 'Payments · Invoila',
};

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-sm text-muted">Payments received across your invoices.</p>
      </div>
      <PaymentsTable payments={payments} />
    </div>
  );
}
