"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cliniqflow_cookie_notice_ack";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-2xl rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-4 shadow-lg sm:left-auto sm:right-6"
    >
      <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
        CliniqFlow uses strictly necessary cookies for authentication and workspace
        context only. See our{" "}
        <Link href="/cookies" className="font-semibold text-[color:var(--accent)]">
          Cookie Policy
        </Link>
        .
      </p>
      <button
        type="button"
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, "1");
          setVisible(false);
        }}
        className="mt-3 rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-semibold text-white"
      >
        Understood
      </button>
    </div>
  );
}
