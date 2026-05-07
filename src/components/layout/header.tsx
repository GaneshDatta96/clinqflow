"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, Stethoscope, Users } from "lucide-react";
import clsx from "clsx";

const appNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "New Intake", href: "/create-demo", icon: Stethoscope },
];

const marketingNavigation = [
  { name: "Features", href: "#features" },
  { name: "Outcomes", href: "#outcomes" },
  { name: "Workflow", href: "#workflow" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed left-0 top-0 z-[100] w-full border-b border-[color:var(--line)]/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 xl:px-10">
        <Link href="/" className="display-font text-[1.7rem] font-bold tracking-[-0.04em] text-[color:var(--accent)]">
          ModernHealth
        </Link>

        {isHome ? (
          <>
            <nav className="hidden items-center gap-10 md:flex">
              {marketingNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--accent)]"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <a
              href="https://cal.com/ganesh-datta-bygktk/sales-throughput-session"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[color:var(--accent)]/20 transition hover:shadow-[color:var(--accent)]/40"
            >
              Request Demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <nav className="flex flex-wrap items-center justify-end gap-1 rounded-full border border-[color:var(--line)] bg-white/78 p-1.5 shadow-[0_10px_30px_rgba(27,44,52,0.08)]">
              {appNavigation.map((item) => (
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
        )}
      </div>
    </header>
  );
}
