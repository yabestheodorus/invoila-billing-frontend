'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { FiCheck, FiLink } from 'react-icons/fi';

/** Copies the public payment link (`/pay/<payToken>`) for an invoice to the clipboard. */
export function CopyLinkButton({ payToken }: { payToken: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/pay/${payToken}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Payment link copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
    >
      {copied ? <FiCheck className="size-3.5" /> : <FiLink className="size-3.5" />}
      {copied ? 'Copied' : 'Get link'}
    </button>
  );
}
