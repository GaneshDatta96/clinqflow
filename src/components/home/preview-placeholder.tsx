export function PreviewPlaceholder() {
  return (
    <div className="absolute inset-0 bg-[color:var(--surface-muted)]" aria-hidden>
      <div className="flex h-full flex-col gap-3 p-5">
        <div className="h-3 w-28 rounded-full bg-[color:var(--line)]" />
        <div className="h-8 w-2/3 rounded-xl bg-[color:var(--line)]" />
        <div className="mt-2 flex flex-1 gap-3">
          <div className="w-1/3 rounded-xl bg-[color:var(--line)]/80" />
          <div className="flex-1 rounded-xl bg-[color:var(--line)]/60" />
        </div>
      </div>
    </div>
  );
}
