"use client";

import type { ReactNode } from "react";

/**
 * Scales a fixed-width app UI to fit the preview frame using container query width.
 */
export function ScaledAppPreview({
  children,
  designWidth = 1200,
  className = "",
}: {
  children: ReactNode;
  designWidth?: number;
  className?: string;
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
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}
