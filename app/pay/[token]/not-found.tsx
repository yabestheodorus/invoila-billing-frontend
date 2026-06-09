import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="mb-6 flex items-center gap-2">
        <Image src="/favicon.png" alt="Invoila" width={32} height={32} className="rounded-lg" />
        <span className="font-heading text-lg font-semibold">Invoila</span>
      </div>
      <h1 className="text-lg font-semibold">Invoice not found</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">
        This payment link is invalid or has expired. Please check the link or contact the sender.
      </p>
    </main>
  );
}
