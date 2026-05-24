import Link from "next/link";
import { BRAND } from "@/lib/brand/site";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-semibold tracking-[-0.03em] text-[color:var(--primary)] ${className}`}
    >
      <span
        aria-hidden
        className="flex flex-col gap-0.5"
      >
        <span className="h-1 w-4 rounded-full bg-[color:var(--accent)]" />
        <span className="h-1 w-3 rounded-full bg-[color:var(--accent-soft)]" />
        <span className="h-1 w-5 rounded-full bg-[color:var(--primary)]/70" />
      </span>
      <span className="text-[1.35rem]">{BRAND.nameDisplay}</span>
    </Link>
  );
}
