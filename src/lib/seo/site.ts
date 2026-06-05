import { BRAND } from "@/lib/brand/site";

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.APP_URL ??
  "https://cliniqflow.app";

export const SITE_NAME = BRAND.nameDisplay;

export const DEFAULT_DESCRIPTION = BRAND.positioning;

export const OG_IMAGE_PATH = "/og/cliniqflow-og.png";

export const OG_IMAGE_ALT =
  "CliniqFlow — patient intake and documentation workflow software for clinics";
