"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Avoid SSR/client mismatches for decorative client-only UI (e.g. homepage previews). */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return fallback;
  }

  return children;
}
