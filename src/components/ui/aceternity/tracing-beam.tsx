"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function TracingBeam({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className={cn("relative mx-auto w-full max-w-3xl", className)}>
      <div className="absolute left-0 top-3 h-full w-px bg-[color:var(--line)] md:left-4">
        <motion.div
          style={{ height }}
          className="absolute inset-x-0 top-0 w-px bg-gradient-to-b from-[color:var(--accent)] to-transparent"
        />
        <motion.div
          style={{ top: height }}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border border-[color:var(--accent)] bg-[color:var(--surface-raised)] shadow-[0_0_12px_rgba(124,58,237,0.35)]"
        />
      </div>
      <div className="pl-6 md:pl-12">{children}</div>
    </div>
  );
}
