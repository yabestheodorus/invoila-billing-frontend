import { formatDate, formatIDR } from '@/lib/format';
import type { PreviewData } from '@/types/invoice';
import { PartyView } from './PartyView';

/* ── Invoice tab: the document ───────────────────────── */
export function InvoiceDocument({ data }: { data: PreviewData }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl bg-surface p-6 shadow-sm ring-1 ring-border sm:p-8">
      <div className="grid grid-cols-3 gap-4">
        <Meta label="Invoice No" value={data.meta.invoiceNo || '—'} />
        <Meta label="Issued" value={data.meta.issued ? formatDate(data.meta.issued) : '—'} />
        <Meta label="Due date" value={data.meta.dueDate ? formatDate(data.meta.dueDate) : '—'} />
      </div>

      <div className="my-6 border-t border-border" />

      <div className="grid grid-cols-2 gap-6">
        <PartyView label="From" party={data.from} />
        <PartyView label="To" party={data.to} />
      </div>

      <div className="my-6 border-t border-border" />

      {/* Line items — item (+ qty × price subline) on the left, amount right */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted">
          <span>Description</span>
          <span>Amount</span>
        </div>
        {data.items.map((item) => (
          <div key={item.id} className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium">{item.description || '—'}</p>
              <p className="mt-0.5 text-xs tabular-nums text-muted">
                {item.qty} × {formatIDR(item.price)}
              </p>
            </div>
            <p className="shrink-0 tabular-nums">{formatIDR(item.qty * item.price)}</p>
          </div>
        ))}
      </div>

      <div className="my-6 border-t border-border" />

      <dl className="ml-auto max-w-xs space-y-2 text-sm">
        <TotalRow label="Subtotal" value={formatIDR(data.subtotal)} muted />
        <TotalRow label={`Discount (${data.discountPct}%)`} value={`-${formatIDR(data.discountAmount)}`} muted />
        <div className="flex items-center justify-between border-t border-border pt-2 text-base font-semibold">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatIDR(data.total)}</dd>
        </div>
      </dl>

      {data.notes && (
        <div className="mt-6 space-y-1 border-t border-border pt-4 text-[11px] leading-relaxed text-muted">
          <p className="font-medium uppercase tracking-wide">Note</p>
          <p className="whitespace-pre-line">{data.notes}</p>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

function TotalRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={muted ? 'text-muted' : ''}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
