"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type AnimatedTooltipItem = {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
};

export function AnimatedTooltip({
  items,
  className,
}: {
  items: AnimatedTooltipItem[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<string | number | null>(null);
  const springConfig = { stiffness: 120, damping: 14 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-8, 8]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-20, 20]), springConfig);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="relative"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <motion.div
            style={{ translateX, rotate }}
            className="flex h-10 w-10 cursor-default items-center justify-center rounded-full border border-[color:var(--line)] bg-white text-[color:var(--foreground)] shadow-sm"
          >
            {item.icon ?? (
              <span className="text-xs font-semibold">{String(item.label[0])}</span>
            )}
          </motion.div>
          <AnimatePresence>
            {hovered === item.id ? (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                className="absolute -top-12 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[color:var(--line)] bg-[color:var(--foreground)] px-3 py-1.5 text-xs font-medium text-white shadow-lg"
              >
                {item.label}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function AnimatedTooltipHint({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open ? (
          <motion.span
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[14rem] -translate-x-1/2 rounded-lg border border-[color:var(--line)] bg-[color:var(--foreground)] px-2.5 py-1.5 text-center text-xs font-medium leading-5 text-white shadow-lg"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
