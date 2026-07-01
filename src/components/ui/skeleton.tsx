export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[color:var(--line)]/70 ${className}`}
      aria-hidden
    />
  );
}

export function SkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-3.5 ${index === lines - 1 ? "w-4/5" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonPageHeader() {
  return (
    <div className="space-y-3" aria-busy aria-label="Loading page">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-64 max-w-full" />
      <Skeleton className="h-4 w-80 max-w-full" />
    </div>
  );
}

export function SkeletonAuthForm() {
  return (
    <div className="space-y-4" aria-busy aria-label="Loading form">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-14" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="mt-2 h-12 w-full rounded-full" />
    </div>
  );
}

export function SkeletonFormCard({ fields = 4 }: { fields?: number }) {
  return (
    <div
      className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/80 p-6"
      aria-busy
      aria-label="Loading form"
    >
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

export function SkeletonList({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="space-y-3" aria-busy aria-label="Loading list">
      {Array.from({ length: rows }).map((_, index) => (
        <li
          key={index}
          className="flex items-center justify-between rounded-xl border border-[color:var(--line)] bg-white/80 px-4 py-3"
        >
          <Skeleton className="h-4 w-48 max-w-[70%]" />
          <Skeleton className="h-4 w-20" />
        </li>
      ))}
    </ul>
  );
}

export function SkeletonInvitePanel() {
  return (
    <section
      className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/80 p-6"
      aria-busy
      aria-label="Loading invites"
    >
      <Skeleton className="h-6 w-36" />
      <SkeletonText lines={2} />
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-11 min-w-[200px] flex-1" />
        <Skeleton className="h-11 w-40" />
        <Skeleton className="h-11 w-28 rounded-full" />
      </div>
      <SkeletonList rows={3} />
    </section>
  );
}

export function SkeletonEncounterSearch() {
  return (
    <div className="flex gap-2" aria-busy aria-label="Loading search">
      <Skeleton className="h-10 max-w-md flex-1 rounded-full" />
      <Skeleton className="h-10 w-24 rounded-full" />
    </div>
  );
}

export function SkeletonRazorpayButton({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      className={`h-11 min-w-[9rem] rounded-full ${className}`}
      aria-label="Loading payment button"
    />
  );
}
