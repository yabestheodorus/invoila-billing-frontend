import Link from 'next/link';
import type { InvoiceDetail } from '@/types/invoice';
import { XIcon } from '../icons';
import { InvoiceDocument } from './InvoiceDocument';
import { EmailPreview } from './EmailPreview';

export type PreviewTab = 'invoice' | 'email';

/** Right pane: Invoice / Email tabs over a dotted background. */
export function PreviewPane({
  tab,
  onTabChange,
  data,
  message,
}: {
  tab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
  data: InvoiceDetail;
  message: string;
}) {
  return (
    <div className="flex flex-1 flex-col border-t border-border lg:border-l lg:border-t-0">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex gap-1">
          <TabButton active={tab === 'invoice'} onClick={() => onTabChange('invoice')}>
            Invoice
          </TabButton>
          <TabButton active={tab === 'email'} onClick={() => onTabChange('email')}>
            Email
          </TabButton>
        </div>
        <Link href="/invoices" aria-label="Close" className="text-muted hover:text-foreground">
          <XIcon />
        </Link>
      </header>

      <div
        className="flex-1 px-6 py-8"
        style={{
          backgroundColor: 'var(--background)',
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {tab === 'invoice' ? (
          <InvoiceDocument detail={data} />
        ) : (
          <EmailPreview detail={data} message={message} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'border-b-2 px-3 pb-2.5 pt-1 text-sm font-medium transition',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted hover:text-foreground',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
