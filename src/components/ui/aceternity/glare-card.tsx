"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

export function GlareCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.setProperty("--glare-x", `${x}px`);
    el.style.setProperty("--glare-y", `${y}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-[color:var(--primary)] bg-[color:var(--surface-raised)] shadow-[var(--shadow)]",
        className,
      )}
      style={
        {
          "--glare-x": "50%",
          "--glare-y": "50%",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(480px circle at var(--glare-x) var(--glare-y), rgba(124,58,237,0.12), transparent 45%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
