"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export function AnimatedTestimonials({
  items,
  className,
}: {
  items: Testimonial[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const current = items[active];

  if (!current) return null;

  return (
    <div className={cn("rounded-[1.75rem] border border-[color:var(--line)] bg-white p-6 sm:p-8", className)}>
      <Quote className="h-8 w-8 text-[color:var(--accent)]/40" />
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-4"
        >
          <p className="font-serif text-lg leading-relaxed text-[color:var(--foreground)]">
            &ldquo;{current.quote}&rdquo;
          </p>
          <p className="mt-4 text-sm font-semibold text-[color:var(--foreground)]">
            {current.name}
          </p>
          <p className="text-xs text-[color:var(--muted)]">{current.role}</p>
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 flex gap-2">
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Show testimonial from ${item.name}`}
            onClick={() => setActive(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === active
                ? "w-8 bg-[color:var(--accent)]"
                : "w-2 bg-[color:var(--line)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
