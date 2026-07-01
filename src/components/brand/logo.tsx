import Link from "next/link";
import { BRAND_ASSETS } from "@/lib/brand/site";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="CliniqFlow home"
    >
      <img
        src={BRAND_ASSETS.logo}
        alt="CliniqFlow"
        width={220}
        height={56}
        style={{ aspectRatio: "220 / 56" }}
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
