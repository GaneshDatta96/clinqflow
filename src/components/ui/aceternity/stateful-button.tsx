"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonState = "idle" | "loading" | "success";

export function StatefulButton({
  children,
  successLabel,
  loadingLabel,
  onClick,
  disabled,
  className,
  type = "button",
}: {
  children: React.ReactNode;
  successLabel?: string;
  loadingLabel?: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const [state, setState] = useState<ButtonState>("idle");

  useEffect(() => {
    if (state !== "success") return;
    const timer = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function handleClick() {
    if (state !== "idle" || disabled || !onClick) return;
    setState("loading");
    try {
      await onClick();
      setState("success");
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      type={type}
      disabled={disabled || state === "loading"}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:opacity-60",
        state === "success"
          ? "bg-emerald-600 text-white"
          : "bg-[color:var(--accent)] text-white",
        className,
      )}
    >
      {state === "loading" ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {loadingLabel ?? children}
        </>
      ) : state === "success" ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          {successLabel ?? "Done"}
        </>
      ) : (
        children
      )}
    </button>
  );
}
