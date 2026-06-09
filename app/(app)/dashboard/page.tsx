import type { Metadata } from 'next';
import Link from 'next/link';
import { FiAlertCircle, FiClock, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { getDashboard, getOnboardingStatus } from '@/lib/api/server';
import { formatIDR } from '@/lib/format';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { PromoCards } from '@/components/dashboard/PromoCards';
import { OnboardingCard } from '@/components/dashboard/OnboardingCard';

export const metadata: Metadata = {
  title: 'Dashboard · Invoila',
};

export default async function DashboardPage() {
  // One request returns everything the dashboard renders.
  const [{ summary, recentInvoices, recentActivity }, onboarding] = await Promise.all([
    getDashboard(),
    getOnboardingStatus(),
  ]);

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Good morning, Business Owner</h1>
          <p className="mt-1 text-sm text-muted">{today}</p>
        </div>
        <Link
          href="/invoices/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          <FiFileText className="size-4" />
          Create Invoice
        </Link>
      </div>

      <OnboardingCard baseStatus={onboarding} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          tone="green"
          icon={FiTrendingUp}
          label="Total Collected"
          value={formatIDR(summary.totalCollected)}
          badge={`${summary.paymentsReceived} payments received`}
          barWidth={70}
        />
        <MetricCard
          tone="orange"
          icon={FiClock}
          label="Pending Invoices"
          value={formatIDR(summary.pendingAmount)}
          badge={`${summary.pendingCount} Invoices`}
          barWidth={45}
        />
        <MetricCard
          tone="red"
          icon={FiAlertCircle}
          label="Overdue Payment"
          value={formatIDR(summary.overdueAmount)}
          badge={summary.overdueCount > 0 ? `${summary.overdueCount} overdue` : 'All clear'}
          barWidth={30}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInvoices invoices={recentInvoices} />
        </div>
        <ActivityFeed events={recentActivity} seeAllHref="/activity" />
      </div>

      <PromoCards />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted">
        <p>© 2026 Invoila Indonesia. Pemberdayaan UKM Lokal.</p>
        <nav className="flex items-center gap-5">
          <Link href="#" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-foreground">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-foreground">
            Contact Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
