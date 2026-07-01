import { SkeletonPageHeader } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="rounded-[2rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-strong)] px-6 py-6 sm:px-8">
        <SkeletonPageHeader />
      </section>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="h-80 animate-pulse rounded-[2rem] bg-[color:var(--line)]/50" aria-hidden />
        <div className="h-80 animate-pulse rounded-[2rem] bg-[color:var(--line)]/40" aria-hidden />
      </div>
    </div>
  );
}
