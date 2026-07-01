"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LampHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col items-center overflow-hidden", className)}>
      <div className="relative z-10 w-full">{children}</div>
      <motion.div
        initial={{ opacity: 0.5, width: "8rem" }}
        whileInView={{ opacity: 1, width: "16rem" }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="absolute inset-auto z-0 h-36 w-[16rem] -translate-y-16 rounded-full bg-[color:var(--accent)] opacity-20 blur-3xl"
      />
      <div className="absolute inset-auto z-0 h-px w-full -translate-y-8 bg-gradient-to-r from-transparent via-[color:var(--accent)]/40 to-transparent" />
    </div>
  );
}
