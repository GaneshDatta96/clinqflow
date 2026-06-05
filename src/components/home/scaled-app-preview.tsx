"use client";

import type { ReactNode } from "react";

/**
 * Scales a fixed-width app UI to fit the preview frame using container query width.
 */
export function ScaledAppPreview({
  children,
  designWidth = 1200,
  className = "",
  fadeBottom = false,
  padding = true,
}: {
  children: ReactNode;
  designWidth?: number;
  className?: string;
  fadeBottom?: boolean;
  padding?: boolean;
}) {
  const scaleExpr = `calc(100cqw / ${designWidth}px)`;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[color:var(--background)] ${className}`}>
      <div
        className="origin-top-left pointer-events-none select-none"
        style={{
          width: designWidth,
          transform: `scale(${scaleExpr})`,
        }}
      >
        <div className={padding ? "p-4 sm:p-5" : ""}>{children}</div>
      </div>
      {fadeBottom && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/85 to-transparent"
          aria-hidden
        />
      )}
    </div>
  );
}
