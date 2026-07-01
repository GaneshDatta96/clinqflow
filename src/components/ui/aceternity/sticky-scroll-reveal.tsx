"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";

export type StickyScrollItem = {
  title: string;
  description: string;
  step?: string;
  content?: React.ReactNode;
};

export function StickyScrollReveal({
  items,
  className,
}: {
  items: StickyScrollItem[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      items.length - 1,
      Math.max(0, Math.floor(value * items.length)),
    );
    setActive(next);
  });

  const current = items[active] ?? items[0];

  return (
    <div ref={ref} className={cn("relative flex gap-10 lg:gap-16", className)}>
      <div className="hidden lg:block lg:w-[40%]">
        <div className="sticky top-28">
          <motion.div
            key={current?.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-3"
          >
            {current?.step ? <p className="section-label">{current.step}</p> : null}
            <h3 className="display-font text-2xl tracking-tight text-[color:var(--foreground)]">
              {current?.title}
            </h3>
            <p className="font-serif text-sm leading-relaxed text-[color:var(--muted-strong)]">
              {current?.description}
            </p>
          </motion.div>
          <div className="mt-8 flex gap-2">
            {items.map((item, index) => (
              <span
                key={item.title}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === active
                    ? "w-8 bg-[color:var(--accent)]"
                    : "w-2 bg-[color:var(--line)]",
                )}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-6">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-5 sm:p-6"
          >
            {item.step ? <p className="section-label lg:hidden">{item.step}</p> : null}
            <h3 className="display-font mt-2 text-lg tracking-tight lg:hidden">
              {item.title}
            </h3>
            <p className="mt-2 font-serif text-sm leading-relaxed text-[color:var(--muted-strong)] lg:hidden">
              {item.description}
            </p>
            {item.content ? <div className="mt-4">{item.content}</div> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
