"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, LayoutDashboard, Settings, Users } from "lucide-react";
import clsx from "clsx";
import { BrandLogo } from "@/components/brand/logo";
import { BRAND } from "@/lib/brand/site";

const appNavigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/app/patients", icon: Users },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

const marketingNavigation = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed left-0 top-0 z-[100] w-full border-b border-[color:var(--line)] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 xl:px-10">
        <BrandLogo />

        {isHome ? (
          <>
            <nav className="hidden items-center gap-8 md:flex">
              {marketingNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--primary)]"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <a
              href={BRAND.demoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[color:var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--accent)]/90"
            >
              Book demo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        ) : (
          <nav className="flex flex-wrap items-center justify-end gap-1 rounded-xl border border-[color:var(--line)] bg-white p-1">
            {appNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition duration-200",
                  isActivePath(pathname, item.href)
                    ? "bg-[color:var(--primary)] text-white"
                    : "text-[color:var(--muted-strong)] hover:bg-[color:var(--background)] hover:text-[color:var(--foreground)]",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
