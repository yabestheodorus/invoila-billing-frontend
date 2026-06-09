import type { Metadata } from 'next';
import { getActivities } from '@/lib/api/server';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

export const metadata: Metadata = {
  title: 'Activity · Invoila',
};

export default async function ActivityPage() {
  const activity = await getActivities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted">All invoice activity across your account.</p>
      </div>
      <ActivityFeed events={activity} title="All Activity" />
    </div>
  );
}
