"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Compare({
  beforePanel,
  afterPanel,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: {
  beforePanel: React.ReactNode;
  afterPanel: React.ReactNode;
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
        <div className="absolute inset-0 z-0 p-6">{afterPanel}</div>
        <div
          className="absolute inset-y-0 left-0 z-[1] overflow-hidden border-r-2 border-[color:var(--accent)]/40 bg-[color:var(--surface-muted)] p-6"
          style={{ width: `${position}%` }}
        >
          {beforePanel}
        </div>
        <input
          type="range"
          min={8}
          max={92}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Compare before and after"
          className="absolute inset-x-4 bottom-4 z-[2] w-[calc(100%-2rem)] accent-[color:var(--accent)]"
        />
      </div>
      <div className="flex justify-between border-t border-[color:var(--line)] px-4 py-2 text-xs font-medium text-[color:var(--muted)]">
        <span>{beforeLabel}</span>
        <span>{afterLabel}</span>
      </div>
    </div>
  );
}
