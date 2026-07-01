"use client";

import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

type TooltipProps = {
  label: string;
  children?: ReactNode;
  side?: "top" | "bottom";
  showIcon?: boolean;
  className?: string;
};

export function Tooltip({
  label,
  children,
  side = "top",
  showIcon = false,
  className = "",
}: TooltipProps) {
  const position =
    side === "top"
      ? "bottom-full left-1/2 mb-2 -translate-x-1/2"
      : "top-full left-1/2 mt-2 -translate-x-1/2";

  return (
    <span className={`group relative inline-flex items-center ${className}`}>
      {children}
      {showIcon && !children ? (
        <HelpCircle
          className="h-4 w-4 text-[color:var(--muted)] transition-colors group-hover:text-[color:var(--accent)]"
          aria-hidden
        />
      ) : null}
      <span
        role="tooltip"
        className={`pointer-events-none absolute ${position} z-20 w-max max-w-[14rem] rounded-lg border border-[color:var(--line)] bg-[color:var(--foreground)] px-2.5 py-1.5 text-center text-xs font-medium leading-5 text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100`}
      >
        {label}
      </span>
    </span>
  );
}
