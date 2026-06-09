import { FiRepeat } from 'react-icons/fi';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatIDR } from '@/lib/format';
import type { BillingScheduleRecord } from '@/lib/api/server';

const TYPE_LABEL: Record<BillingScheduleRecord['type'], string> = {
  recurring: 'Recurring',
  installments: 'Installments',
  deposit_balance: 'Deposit + balance',
};

/** Human summary of a saved billing schedule. */
function summary(s: BillingScheduleRecord): string {
  if (s.type === 'recurring') {
    return `Repeats ${s.recurRepeat ?? '—'}${s.recurUntil ? ` until ${s.recurUntil.slice(0, 10)}` : ''}`;
  }
  if (s.type === 'installments') {
    return `${s.installmentCount ?? '—'} invoices, ${s.installmentInterval ?? '—'}`;
  }
  return 'Deposit + balance';
}

export function BillingSchedulesCard({ schedules }: { schedules: BillingScheduleRecord[] }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5">
      <h2 className="text-base font-semibold">Billing schedules</h2>
      <p className="mt-1 text-sm text-muted">Reusable recurring, installment, and deposit schedules.</p>

      {schedules.length === 0 ? (
        <EmptyState
          bordered={false}
          size="sm"
          icon={FiRepeat}
          title="No billing schedules yet"
          description="Recurring, installment and deposit + balance plans you set up will be saved here for reuse."
        />
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {schedules.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{TYPE_LABEL[s.type]}</p>
                <p className="truncate text-xs text-muted">{summary(s)}</p>
              </div>
              <span className="shrink-0 text-sm font-medium">{formatIDR(Number(s.total))}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
