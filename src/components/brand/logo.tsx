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
        alt="CliniqFlow — intake, insight, better care"
        width={240}
        height={120}
        style={{ aspectRatio: "2 / 1" }}
        className="h-11 w-auto sm:h-12"
      />
    </Link>
  );
}
