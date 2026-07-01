"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function FocusCards({
  items,
  className,
  activeId,
  onSelect,
}: {
  items: { id: string; title: string; subtitle?: string; body?: string }[];
  className?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <article
          key={item.id}
          role={onSelect ? "button" : undefined}
          tabIndex={onSelect ? 0 : undefined}
          onClick={onSelect ? () => onSelect(item.id) : undefined}
          onKeyDown={
            onSelect
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(item.id);
                  }
                }
              : undefined
          }
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "rounded-[1.35rem] border px-4 py-3.5 transition duration-300",
            activeId === item.id
              ? "border-transparent bg-[color:var(--foreground)] text-white shadow-[0_8px_24px_rgba(11,16,32,0.12)]"
              : hovered === null || hovered === item.id
                ? "border-[color:var(--line)] bg-white/80 opacity-100"
                : "border-transparent bg-white/40 opacity-45",
            onSelect && "cursor-pointer",
          )}
        >
          <p
            className={cn(
              "font-semibold",
              activeId === item.id ? "text-white" : "text-[color:var(--foreground)]",
            )}
          >
            {item.title}
          </p>
          {item.subtitle ? (
            <p
              className={cn(
                "mt-1 text-sm line-clamp-2",
                activeId === item.id ? "text-white/80" : "text-[color:var(--muted)]",
              )}
            >
              {item.subtitle}
            </p>
          ) : null}
          {item.body ? (
            <p
              className={cn(
                "mt-2 text-xs uppercase tracking-wider",
                activeId === item.id ? "text-white/70" : "text-[color:var(--muted)]",
              )}
            >
              {item.body}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}
