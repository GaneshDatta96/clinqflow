"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MultiStepLoader({
  loading,
  steps,
  currentStep,
  className,
}: {
  loading: boolean;
  steps: string[];
  currentStep: number;
  className?: string;
}) {
  if (!loading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-[200] flex items-center justify-center bg-[color:var(--background)]/80 backdrop-blur-sm",
          className,
        )}
        role="status"
        aria-live="polite"
        aria-label="Loading"
      >
        <div className="w-full max-w-md rounded-[1.75rem] border border-[color:var(--line)] bg-white p-8 shadow-[var(--shadow)]">
          <p className="section-label">Please wait</p>
          <ul className="mt-6 space-y-4">
            {steps.map((step, index) => {
              const done = index < currentStep;
              const active = index === currentStep;
              return (
                <li key={step} className="flex items-center gap-3 text-sm">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  ) : active ? (
                    <LoaderCircle className="h-5 w-5 shrink-0 animate-spin text-[color:var(--accent)]" />
                  ) : (
                    <span className="h-5 w-5 shrink-0 rounded-full border border-[color:var(--line)]" />
                  )}
                  <span
                    className={cn(
                      done && "text-[color:var(--foreground)]",
                      active && "font-medium text-[color:var(--foreground)]",
                      !done && !active && "text-[color:var(--muted)]",
                    )}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
