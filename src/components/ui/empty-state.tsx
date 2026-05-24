export function EmptyState(props: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--line)] bg-white/60 px-6 py-12 text-center">
      <p className="text-lg font-semibold">{props.title}</p>
      <p className="mt-2 text-sm text-[color:var(--muted)]">{props.description}</p>
    </div>
  );
}
