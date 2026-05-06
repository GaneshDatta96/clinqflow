"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  LayoutDashboard,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import clsx from "clsx";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "New Intake", href: "/intake", icon: Stethoscope },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[rgba(248,244,237,0.72)] backdrop-blur-2xl">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(20,33,37,0.18),transparent)]" />
      <div className="mx-auto flex min-h-[5rem] w-full max-w-[1380px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 xl:px-12">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-[color:var(--line)] bg-white/88 shadow-[0_10px_30px_rgba(27,44,52,0.08)]">
            <Stethoscope className="h-5 w-5 text-[color:var(--accent)]" />
          </span>
          <span className="flex flex-col">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-[color:var(--muted)]">
              Intake Workspace
            </span>
            <span className="text-[1.15rem] font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
              Modern Health
            </span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[color:var(--line)] bg-white/72 px-3 py-2 text-xs font-semibold tracking-[0.02em] text-[color:var(--muted-strong)] shadow-sm lg:inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
            Custom clinic demos
          </div>

          <nav className="flex flex-wrap items-center justify-end gap-1 rounded-full border border-[color:var(--line)] bg-white/78 p-1.5 shadow-[0_10px_30px_rgba(27,44,52,0.08)]">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "inline-flex items-center rounded-full px-3.5 py-2.5 text-sm font-semibold transition duration-200",
                  isActivePath(pathname, item.href)
                    ? "bg-[color:var(--foreground)] text-white shadow-[0_12px_30px_rgba(20,33,37,0.16)]"
                    : "text-[color:var(--muted-strong)] hover:bg-white hover:text-[color:var(--foreground)]",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>

          <a
            href="https://cal.com/ganesh-datta-bygktk/sales-throughput-session"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(20,33,37,0.16)] xl:inline-flex"
          >
            Request custom version
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
