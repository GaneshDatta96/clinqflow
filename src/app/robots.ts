import type { MetadataRoute } from "next";
import { ROBOTS_DISALLOW } from "@/lib/seo/routes";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ROBOTS_DISALLOW,
    },
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
