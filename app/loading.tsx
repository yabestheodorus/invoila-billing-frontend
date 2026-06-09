/**
 * Global loading fallback — the Suspense fallback for any route that doesn't
 * define its own `loading.tsx`. Neutral/centered so it works over any context
 * (auth, app, or the public pay page).
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
