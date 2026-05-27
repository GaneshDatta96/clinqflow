import type { ReactNode } from "react";

const aspectClasses = {
  wide: "aspect-[16/10]",
  tall: "aspect-[4/5]",
  cinematic: "aspect-[21/9]",
} as const;

export function ProductPreviewFrame({
  children,
  label = "cliniqflow.app",
  aspect = "wide",
  className = "",
}: {
  children: ReactNode;
  label?: string;
  aspect?: keyof typeof aspectClasses;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.25rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-[0_12px_40px_rgba(11,16,32,0.06)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-[color:var(--line)] bg-[color:var(--surface-raised)] px-3 py-2 sm:px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-w-0 flex-1 rounded-md border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-3 py-1 text-center text-[10px] font-medium tracking-[-0.01em] text-[color:var(--muted)] sm:text-[11px]">
          <span className="truncate">{label}</span>
        </div>
      </div>

      <div className={`@container relative w-full overflow-hidden ${aspectClasses[aspect]}`}>
        {children}
      </div>
    </div>
  );
}
