import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState(props: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}) {
  const Icon = props.icon;

  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-dashed border-[color:var(--line)] bg-white/60 px-6 py-12 text-center",
        props.className,
      )}
    >
      {Icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)]">
          <Icon className="h-5 w-5 text-[color:var(--accent)]" />
        </div>
      ) : null}
      <p className="display-font text-lg tracking-tight text-[color:var(--foreground)]">
        {props.title}
      </p>
      <p className="mx-auto mt-2 max-w-sm font-serif text-sm leading-relaxed text-[color:var(--muted)]">
        {props.description}
      </p>
      {props.action ? <div className="mt-6 flex justify-center">{props.action}</div> : null}
    </div>
  );
}
