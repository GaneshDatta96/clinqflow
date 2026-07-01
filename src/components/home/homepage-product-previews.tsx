"use client";

import Image from "next/image";
import { PreviewPlaceholder } from "@/components/home/preview-placeholder";
import { ProductPreviewFrame } from "@/components/home/product-preview-frame";

type PreviewProps = {
  className?: string;
};

export function HeroOperationalPreview({ className = "" }: PreviewProps) {
  return (
    <ProductPreviewFrame
      label="cliniqflow.app/app/dashboard"
      aspect="wide"
      elevated
      className={className}
      ariaLabel="CliniqFlow practitioner dashboard preview showing patient intake queue and encounter review"
    >
      <Image
        src="/marketing/hero-dashboard.webp"
        alt="CliniqFlow practitioner dashboard with intake queue and draft SOAP review"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover object-top"
      />
    </ProductPreviewFrame>
  );
}

export { PreviewPlaceholder };
