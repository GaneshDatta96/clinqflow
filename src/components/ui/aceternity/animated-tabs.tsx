"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedTabs({
  tabs,
  className,
}: {
  tabs: { id: string; label: string; content: React.ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  const current = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex flex-wrap gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "relative z-10 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              active === tab.id
                ? "text-[color:var(--foreground)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]",
            )}
          >
            {active === tab.id ? (
              <motion.span
                layoutId="animated-tab-pill"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            ) : null}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
      <motion.div
        key={current?.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-5"
      >
        {current?.content}
      </motion.div>
    </div>
  );
}
