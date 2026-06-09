import { addressLines } from '@/lib/invoice-utils';
import type { Party } from '@/types/invoice';

/** Read-only From/To block used in both the Invoice and Email previews. */
export function PartyView({ label, party, compact }: { label: string; party: Party; compact?: boolean }) {
  const name = party.name.trim() || 'Customer name';
  const initial = name.charAt(0).toUpperCase();
  const lines = addressLines(party);
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
          {initial}
        </span>
        <p className="text-sm font-semibold">{name}</p>
      </div>
      <p className="mt-2 break-all text-xs text-muted">{party.email || '—'}</p>
      {!compact && lines.length > 0 && (
        <div className="mt-2 space-y-0.5 text-xs text-muted">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
