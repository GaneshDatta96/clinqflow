"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Compare({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)]",
        className,
      )}
    >
      <div className="relative min-h-[14rem]">
        <div className="absolute inset-0 p-6">{after}</div>
        <div
          className="absolute inset-0 overflow-hidden border-r border-[color:var(--accent)]/40 bg-[color:var(--surface-muted)] p-6"
          style={{ width: `${position}%` }}
        >
          {before}
        </div>
        <input
          type="range"
          min={8}
          max={92}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute inset-x-4 bottom-4 z-10 w-[calc(100%-2rem)] accent-[color:var(--accent)]"
        />
      </div>
      <div className="flex justify-between border-t border-[color:var(--line)] px-4 py-2 text-xs font-medium text-[color:var(--muted)]">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
