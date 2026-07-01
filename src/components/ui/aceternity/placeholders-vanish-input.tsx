"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PlaceholdersVanishInput({
  placeholders,
  value,
  onChange,
  onSubmit,
  type = "text",
  name,
  required,
  className,
  inputClassName,
}: {
  placeholders: string[];
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  type?: string;
  name?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
}) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 2800);
  }, [placeholders.length]);

  useEffect(() => {
    startAnimation();
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [startAnimation]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSubmit) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-[color:var(--line)] bg-white",
        className,
      )}
    >
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative z-10 w-full bg-transparent px-4 py-3 text-[color:var(--foreground)] outline-none",
          inputClassName,
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center px-4">
        <AnimatePresence mode="wait">
          {!value ? (
            <motion.span
              key={`placeholder-${currentPlaceholder}`}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-[color:var(--muted)]"
            >
              {placeholders[currentPlaceholder]}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
