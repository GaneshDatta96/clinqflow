"use client";

import { useCallback, useRef, useState } from "react";
import { Check, GripVertical, X } from "lucide-react";

const BEFORE_ITEMS = [
  "Clipboards in the waiting room",
  "Staff re-typing patient history",
  "Practitioner starts cold every visit",
] as const;

const AFTER_ITEMS = [
  "Signed link before the appointment",
  "Structured specialty questionnaires",
  "Review-ready draft documentation",
] as const;

const MIN = 12;
const MAX = 88;
const DEFAULT = 50;

function CompareList({
  items,
  variant,
}: {
  items: readonly string[];
  variant: "before" | "after";
}) {
  const isBefore = variant === "before";

  return (
    <ul className="space-y-3.5">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-2.5 text-sm leading-snug ${
            isBefore ? "text-[color:var(--muted-strong)]" : "text-[color:var(--foreground)]"
          }`}
        >
          {isBefore ? (
            <X className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--muted)]" aria-hidden />
          ) : (
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" aria-hidden />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function IntakeCompareSection() {
  const [position, setPosition] = useState(DEFAULT);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const next = Math.min(MAX, Math.max(MIN, ratio * 100));
    setPosition(next);
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFromClientX(event.clientX);
    },
    [updateFromClientX],
  );

  const onPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const innerWidth = `${(100 / position) * 100}%`;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] shadow-[0_24px_60px_rgba(11,16,32,0.06)]">
      <div
        ref={containerRef}
        className="relative min-h-[17rem] cursor-grab select-none touch-none active:cursor-grabbing sm:min-h-[16rem]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* CliniqFlow side — full width, content anchored right */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-violet-50/90 via-white to-[color:var(--surface-raised)]"
          aria-hidden={position >= MAX - 2}
        >
          <div className="flex h-full min-h-[17rem] items-center justify-end px-6 py-8 sm:min-h-[16rem] sm:px-8">
            <div className="w-full max-w-[18rem] sm:w-1/2 sm:max-w-none sm:pr-4">
              <CompareList items={AFTER_ITEMS} variant="after" />
            </div>
          </div>
        </div>

        {/* Paper chaos side — clipped overlay, content anchored left */}
        <div
          className="absolute inset-y-0 left-0 z-[1] overflow-hidden border-r-2 border-[color:var(--accent)] bg-[color:var(--surface-muted)]"
          style={{ width: `${position}%` }}
          aria-hidden={position <= MIN + 2}
        >
          <div className="h-full" style={{ width: innerWidth }}>
            <div className="flex h-full min-h-[17rem] items-center justify-start px-6 py-8 sm:min-h-[16rem] sm:px-8">
              <div className="w-full max-w-[18rem] sm:w-1/2 sm:max-w-none sm:pl-1">
                <CompareList items={BEFORE_ITEMS} variant="before" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-[2] -translate-x-1/2"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          <div className="relative flex h-full w-px items-center justify-center bg-[color:var(--accent)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[color:var(--accent)] bg-white shadow-[0_8px_24px_rgba(124,58,237,0.25)]">
              <GripVertical className="h-5 w-5 text-[color:var(--accent)]" strokeWidth={2.25} />
            </div>
          </div>
        </div>

        {/* Keyboard-accessible control (visually hidden) */}
        <label className="sr-only" htmlFor="intake-compare-slider">
          Drag to compare paper intake with CliniqFlow
        </label>
        <input
          id="intake-compare-slider"
          type="range"
          min={MIN}
          max={MAX}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Drag to compare paper intake with CliniqFlow"
          className="sr-only"
        />
      </div>

      <div className="flex justify-between border-t border-[color:var(--line)] px-5 py-3 text-xs font-medium">
        <span className="text-[color:var(--muted)]">Paper &amp; inbox chaos</span>
        <span className="text-[color:var(--foreground)]">CliniqFlow</span>
      </div>
    </div>
  );
}
