"use client";

import { cn } from "@/lib/utils";

export type BentoItem = {
  title: string;
  description?: string;
  label?: string;
  className?: string;
  dark?: boolean;
  children?: React.ReactNode;
};

export function BentoGrid({
  items,
  className,
}: {
  items: BentoItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(12rem,auto)] gap-4 lg:grid-cols-12 lg:gap-5",
        className,
      )}
    >
      {items.map((item) => (
        <article
          key={item.title}
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-5 sm:p-6",
            item.dark
              ? "border-[color:rgba(11,16,32,0.12)] bg-[color:var(--charcoal)] text-white"
              : "surface-panel border-[color:var(--line)]",
            item.className,
          )}
        >
          {item.label ? (
            <p className={cn("section-label", item.dark && "text-white/55")}>
              {item.label}
            </p>
          ) : null}
          <h3
            className={cn(
              "display-font mt-2 text-[1.2rem] tracking-tight sm:text-[1.35rem]",
              item.dark ? "text-white" : "text-[color:var(--foreground)]",
            )}
          >
            {item.title}
          </h3>
          {item.description ? (
            <p
              className={cn(
                "mt-2 font-serif text-sm leading-relaxed",
                item.dark ? "text-white/72" : "text-[color:var(--muted-strong)]",
              )}
            >
              {item.description}
            </p>
          ) : null}
          {item.children ? <div className="mt-4 flex-1">{item.children}</div> : null}
        </article>
      ))}
    </div>
  );
}
