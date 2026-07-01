"use client";

import dynamic from "next/dynamic";
import { PreviewPlaceholder } from "@/components/home/preview-placeholder";
import { ProductPreviewFrame } from "@/components/home/product-preview-frame";

export const DashboardProductPreview = dynamic(
  () =>
    import("@/components/home/live-product-previews").then(
      (mod) => mod.DashboardProductPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <ProductPreviewFrame
        label="cliniqflow.app/app/dashboard"
        aspect="wide"
        elevated
        ariaLabel="Loading dashboard preview"
      >
        <PreviewPlaceholder />
      </ProductPreviewFrame>
    ),
  },
);

export const EncounterProductPreview = dynamic(
  () =>
    import("@/components/home/live-product-previews").then(
      (mod) => mod.EncounterProductPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <ProductPreviewFrame
        label="cliniqflow.app/app/encounters"
        aspect="wide"
        elevated
        ariaLabel="Loading encounter preview"
      >
        <PreviewPlaceholder />
      </ProductPreviewFrame>
    ),
  },
);

export const IntakeProductPreview = dynamic(
  () =>
    import("@/components/home/live-product-previews").then(
      (mod) => mod.IntakeProductPreview,
    ),
  {
    ssr: false,
    loading: () => (
      <ProductPreviewFrame
        label="cliniqflow.app/c/intake"
        aspect="tall"
        elevated
        ariaLabel="Loading intake preview"
      >
        <PreviewPlaceholder />
      </ProductPreviewFrame>
    ),
  },
);

export const StickyScrollReveal = dynamic(
  () =>
    import("@/components/ui/aceternity/sticky-scroll-reveal").then(
      (mod) => mod.StickyScrollReveal,
    ),
  {
    loading: () => (
      <div
        className="min-h-[28rem] animate-pulse rounded-[2rem] bg-[color:var(--line)]/40"
        aria-hidden
      />
    ),
  },
);

export const Compare = dynamic(
  () => import("@/components/ui/aceternity/compare").then((mod) => mod.Compare),
  {
    loading: () => (
      <div
        className="min-h-[20rem] animate-pulse rounded-[2rem] bg-[color:var(--line)]/40"
        aria-hidden
      />
    ),
  },
);

export const Timeline = dynamic(
  () => import("@/components/ui/aceternity/timeline").then((mod) => mod.Timeline),
  {
    loading: () => (
      <div
        className="min-h-[24rem] animate-pulse rounded-[2rem] bg-[color:var(--line)]/40"
        aria-hidden
      />
    ),
  },
);

export const AnimatedTestimonials = dynamic(
  () =>
    import("@/components/ui/aceternity/animated-testimonials").then(
      (mod) => mod.AnimatedTestimonials,
    ),
  {
    loading: () => (
      <div
        className="min-h-[18rem] animate-pulse rounded-[2rem] bg-[color:var(--line)]/40"
        aria-hidden
      />
    ),
  },
);
