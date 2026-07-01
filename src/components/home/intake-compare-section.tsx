"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

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

export function IntakeCompareSection() {
  const [position, setPosition] = useState(50);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] shadow-[0_24px_60px_rgba(11,16,32,0.06)]">
      <div className="relative min-h-[15rem] sm:min-h-[14rem]">
        {/* CliniqFlow side — always rendered full width underneath */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-br from-violet-50/90 via-white to-[color:var(--surface-raised)] p-6 sm:p-8"
          aria-hidden={position >= 92}
        >
          <ul className="space-y-3.5">
            {AFTER_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-snug text-[color:var(--foreground)]"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Paper chaos side — clipped overlay */}
        <div
          className="absolute inset-y-0 left-0 z-[1] overflow-hidden border-r-2 border-[color:var(--accent)]/50 bg-[color:var(--surface-muted)] p-6 sm:p-8"
          style={{ width: `${position}%` }}
          aria-hidden={position <= 8}
        >
          <ul className="min-w-[16rem] space-y-3.5 sm:min-w-[18rem]">
            {BEFORE_ITEMS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-snug text-[color:var(--muted-strong)]"
              >
                <X
                  className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--muted)]"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-[2] w-0.5 -translate-x-1/2 bg-[color:var(--accent)]"
          style={{ left: `${position}%` }}
          aria-hidden
        />

        <input
          type="range"
          min={8}
          max={92}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label="Drag to compare paper intake with CliniqFlow"
          className="absolute inset-x-4 bottom-4 z-[3] w-[calc(100%-2rem)] accent-[color:var(--accent)]"
        />
      </div>

      <div className="flex justify-between border-t border-[color:var(--line)] px-4 py-2.5 text-xs font-medium text-[color:var(--muted)]">
        <span>Paper &amp; inbox chaos</span>
        <span>CliniqFlow</span>
      </div>
    </div>
  );
}
