"use client";

export function ProofScreenShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`bg-[color:var(--background)] px-8 py-8 ${className}`}>{children}</div>;
}
