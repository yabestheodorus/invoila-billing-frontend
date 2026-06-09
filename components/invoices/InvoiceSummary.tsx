import { FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { formatIDR } from '@/lib/format';
import type { InvoiceSummary as InvoiceSummaryData } from '@/types/invoice';
import { MetricCard } from '@/components/dashboard/MetricCard';

/** Summary cards computed server-side across ALL invoices (not just the page). */
export function InvoiceSummary({ summary }: { summary: InvoiceSummaryData }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        tone="orange"
        icon={FiClock}
        label="Outstanding"
        value={formatIDR(summary.outstandingAmount)}
        badge={`${summary.unpaidCount} unpaid`}
        barWidth={55}
      />
      <MetricCard
        tone="green"
        icon={FiCheckCircle}
        label="Paid"
        value={formatIDR(summary.paidAmount)}
        badge={`${summary.paidCount} invoices`}
        barWidth={70}
      />
      <MetricCard
        tone="red"
        icon={FiAlertCircle}
        label="Overdue"
        value={formatIDR(summary.overdueAmount)}
        badge={`${summary.overdueCount} overdue`}
        barWidth={30}
      />
    </div>
  );
}
