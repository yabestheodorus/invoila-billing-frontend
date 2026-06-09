export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-8 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-black/5 dark:bg-white/5" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-black/5 dark:bg-white/5" />
    </div>
  );
}
