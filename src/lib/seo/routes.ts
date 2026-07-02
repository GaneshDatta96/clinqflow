import { LEGAL_PAGES } from "@/lib/legal/site";
import { NICHE_PAGES } from "@/lib/seo/niche-pages";

export type SitemapEntry = {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** ISO date of the last meaningful content change for this route. */
  lastModified: string;
};

/** Bump when a page's indexable content changes so GSC re-crawls promptly. */
export const CONTENT_UPDATED = {
  home: "2026-07-02",
  landing: "2026-07-02",
  niche: "2026-07-02",
  legal: "2026-05-30",
  intakeGuide: "2026-07-02",
  clinicWorkflows: "2026-07-02",
} as const;

export const SEO_LANDING_PAGES = [
  { path: "/contact", label: "Contact" },
  { path: "/how-patient-intake-works", label: "How intake works" },
  { path: "/ai-documentation", label: "AI documentation" },
  { path: "/clinic-workflows", label: "Clinic workflows" },
  { path: "/security", label: "Security" },
  { path: "/faq", label: "FAQ" },
] as const;

export const MARKETING_PAGE_PATHS = [
  "/",
  ...SEO_LANDING_PAGES.map((p) => p.path),
  ...NICHE_PAGES.map((p) => `/for/${p.slug}`),
  ...LEGAL_PAGES.map((p) => p.href),
] as const;

export const SITEMAP_ENTRIES: SitemapEntry[] = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly",
    lastModified: CONTENT_UPDATED.home,
  },
  ...SEO_LANDING_PAGES.map((p) => ({
    path: p.path,
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified:
      p.path === "/how-patient-intake-works"
        ? CONTENT_UPDATED.intakeGuide
        : p.path === "/clinic-workflows"
          ? CONTENT_UPDATED.clinicWorkflows
          : CONTENT_UPDATED.landing,
  })),
  ...NICHE_PAGES.map((p) => ({
    path: `/for/${p.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: CONTENT_UPDATED.niche,
  })),
  ...LEGAL_PAGES.map((p) => ({
    path: p.href,
    priority: 0.5,
    changeFrequency: "yearly" as const,
    lastModified: CONTENT_UPDATED.legal,
  })),
];

export const ROBOTS_DISALLOW = [
  "/app/",
  "/proof/",
  "/c/",
  "/intake",
  "/questionnaire",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth/",
  "/invite/",
  "/onboarding",
  "/dashboard",
  "/patients",
];

export function isMarketingPath(pathname: string) {
  if (pathname === "/") return true;
  return MARKETING_PAGE_PATHS.some(
    (p) => p !== "/" && (pathname === p || pathname.startsWith(`${p}/`)),
  );
}
