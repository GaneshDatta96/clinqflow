import { Flower2 } from "lucide-react";

/** Subtle brand motif using Lucide icons only. */
export function PetalAccent({ className = "" }: { className?: string }) {
  return (
    <Flower2
      aria-hidden
      strokeWidth={1.25}
      className={className}
    />
  );
}

export function GradientRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-[color:var(--gradient-mid)] to-transparent opacity-60 ${className}`}
    />
  );
}
