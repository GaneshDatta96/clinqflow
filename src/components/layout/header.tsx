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
  { name: "Product", href: "#product" },
  { name: "Workflow", href: "#workflow" },
  { name: "Pricing", href: "#pricing" },
  { name: "Why it helps", href: "#why-cliniqflow" },
  { name: "FAQ", href: "#faq" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (pathname.startsWith("/proof")) {
    return null;
  }

  return (
    <header className="fixed left-0 top-0 z-[100] w-full border-b border-[color:var(--line)] bg-[color:var(--background)]/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-6 py-3 lg:px-10">
        <BrandLogo />

        {isHome ? (
          <>
            <nav className="hidden items-center gap-7 md:flex">
              {marketingNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-[color:var(--muted-strong)] transition-colors hover:text-[color:var(--foreground)]"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <Link
              href={BRAND.signupHref}
              className="btn-primary !px-4 !py-2.5 !text-sm"
            >
              Sign up
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <nav className="flex flex-wrap items-center justify-end gap-1 rounded-lg border border-[color:var(--line)] bg-[color:var(--surface-raised)] p-1">
            {appNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition duration-200",
                  isActivePath(pathname, item.href)
                    ? "bg-[color:var(--primary)] text-white"
                    : "text-[color:var(--muted-strong)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--foreground)]",
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
