import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  OG_IMAGE_ALT,
  OG_IMAGE_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/site";

type BuildPageMetadataArgs = {
  title: string;
  description?: string;
  path: string;
  robots?: Metadata["robots"];
  openGraphType?: "website" | "article";
  /** Headline rendered on the generated OG image. Defaults to `title`. */
  ogTitle?: string;
  /** Sub-line rendered on the generated OG image. Defaults to `description`. */
  ogSubtitle?: string;
};

function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

/** Builds a per-page OG image URL served by /api/og. */
function buildOgImageUrl(title: string, subtitle: string) {
  const url = new URL("/api/og", SITE_URL);
  url.searchParams.set("title", title);
  url.searchParams.set("subtitle", subtitle);
  return url.toString();
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  robots,
  openGraphType = "website",
  ogTitle,
  ogSubtitle,
}: BuildPageMetadataArgs): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = buildOgImageUrl(ogTitle ?? title, ogSubtitle ?? description);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: openGraphType,
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(robots ? { robots } : {}),
  };
}

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};

export function buildRootMetadata(): Metadata {
  const ogImage = new URL(OG_IMAGE_PATH, SITE_URL).toString();

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      images: [ogImage],
    },
  };
}
