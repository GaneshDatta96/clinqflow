import type { ReactNode } from "react";

const aspectClasses = {
  wide: "aspect-[16/10]",
  tall: "aspect-[4/5]",
  cinematic: "aspect-[21/9]",
  hero: "aspect-[5/4]",
} as const;

export function ProductPreviewFrame({
  children,
  label = "cliniqflow.app",
  aspect = "wide",
  className = "",
  elevated = false,
}: {
  children: ReactNode;
  label?: string;
  aspect?: keyof typeof aspectClasses;
  className?: string;
  elevated?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.15rem] border border-[color:var(--line-strong)] bg-[color:var(--surface-raised)] ${
        elevated
          ? "shadow-[0_1px_0_rgba(11,16,32,0.04),0_20px_50px_rgba(11,16,32,0.1),0_4px_12px_rgba(11,16,32,0.04)]"
          : "shadow-[0_12px_40px_rgba(11,16,32,0.06)]"
      } ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-[color:var(--line)] bg-white px-3 py-2.5 sm:px-4">
        <div className="flex shrink-0 gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="min-w-0 flex-1 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-muted)]/70 px-3 py-1.5 text-center text-[10px] font-medium tracking-[-0.01em] text-[color:var(--muted-strong)] sm:text-[11px]">
          <span className="truncate">{label}</span>
        </div>
      </div>

      <div className={`@container relative w-full overflow-hidden ${aspectClasses[aspect]}`}>
        {children}
      </div>
    </div>
  );
}
