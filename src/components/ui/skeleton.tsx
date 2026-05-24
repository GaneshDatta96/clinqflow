export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[color:var(--line)]/60 ${className}`}
      aria-hidden
    />
  );
}
