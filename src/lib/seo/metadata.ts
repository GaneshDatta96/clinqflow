import type { Metadata } from "next";
import { BRAND_ASSETS } from "@/lib/brand/site";
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
};

function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  robots,
  openGraphType = "website",
}: BuildPageMetadataArgs): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(OG_IMAGE_PATH);

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
    icons: {
      icon: [
        { url: BRAND_ASSETS.mark, type: "image/svg+xml" },
        { url: "/icon", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
      shortcut: "/icon",
    },
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
