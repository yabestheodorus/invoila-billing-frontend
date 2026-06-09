'use client';

import { FiDownload } from 'react-icons/fi';

/**
 * Export the invoice to PDF via the browser's print dialog (Save as PDF). The
 * `@media print` rules in globals.css scope the output to `.print-area`, so the
 * app chrome and on-screen controls are hidden. No PDF library / dependency.
 */
export function ExportPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-md border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
    >
      <FiDownload className="h-4 w-4" />
      Export PDF
    </button>
  );
}
