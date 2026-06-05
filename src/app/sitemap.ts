import type { MetadataRoute } from "next";
import { SITEMAP_ENTRIES } from "@/lib/seo/routes";
import { SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITEMAP_ENTRIES.map((entry) => ({
    url: new URL(entry.path, SITE_URL).toString(),
    lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
