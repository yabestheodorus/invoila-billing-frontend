export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded bg-black/10 dark:bg-white/10" />
          <div className="h-4 w-56 animate-pulse rounded bg-black/5 dark:bg-white/5" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
    </div>
  );
}
