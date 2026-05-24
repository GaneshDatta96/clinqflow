import Image from "next/image";
import Link from "next/link";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="CliniqFlow home"
    >
      <Image
        src="/brand/cliniqflow-logo.png"
        alt="CliniqFlow — Intake. Insight. Better care."
        width={220}
        height={56}
        priority
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  );
}
