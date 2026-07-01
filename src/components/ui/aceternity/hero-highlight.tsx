"use client";

import { cn } from "@/lib/utils";

export function HeroHighlight({
  children,
  highlight,
  className,
}: {
  children: React.ReactNode;
  highlight: string;
  className?: string;
}) {
  const parts = String(children).split(highlight);

  return (
    <h1
      className={cn(
        "display-font text-balance text-[clamp(2.25rem,4.8vw,3.65rem)] leading-[1.02] tracking-tight text-[color:var(--foreground)]",
        className,
      )}
    >
      {parts[0]}
      <span className="relative inline-block">
        <span className="relative z-10">{highlight}</span>
        <span
          aria-hidden
          className="absolute -inset-x-1 bottom-1 z-0 h-3 bg-[color:var(--accent)]/15 md:bottom-2 md:h-4"
        />
      </span>
      {parts[1] ?? ""}
    </h1>
  );
}
