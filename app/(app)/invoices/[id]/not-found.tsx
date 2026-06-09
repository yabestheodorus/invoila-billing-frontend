import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-black/15 p-10 text-center dark:border-white/20">
      <h1 className="text-lg font-semibold">Invoice not found</h1>
      <p className="mt-1 text-sm text-foreground/60">
        The invoice you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/invoices"
        className="mt-4 inline-block rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Back to invoices
      </Link>
    </div>
  );
}
