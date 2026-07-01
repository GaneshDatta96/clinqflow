"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export type TimelineEntry = {
  title: string;
  description: string;
};

export function Timeline({
  items,
  className,
}: {
  items: TimelineEntry[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute left-4 top-0 h-full w-px bg-[color:var(--line)] md:left-8">
        <motion.div
          style={{ height }}
          className="absolute inset-x-0 top-0 w-px bg-gradient-to-b from-[color:var(--accent)] via-[color:var(--gradient-mid)] to-transparent"
        />
      </div>
      <div className="space-y-10">
        {items.map((item, index) => (
          <div key={item.title} className="relative flex gap-6 md:gap-10">
            <div className="flex w-8 shrink-0 justify-center md:w-16">
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-raised)] text-xs font-semibold text-[color:var(--accent)]">
                {index + 1}
              </span>
            </div>
            <div className="pb-2">
              <h3 className="display-font text-lg tracking-tight text-[color:var(--foreground)]">
                {item.title}
              </h3>
              <p className="mt-2 font-serif text-sm leading-relaxed text-[color:var(--muted-strong)]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
