import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { BRAND, BRAND_ASSETS } from "@/lib/brand/site";
import { loadPublicAssetDataUrl } from "@/lib/brand/load-asset";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

function clamp(value: string | null, max: number, fallback: string) {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("title"), 110, BRAND.nameDisplay);
  const subtitle = clamp(searchParams.get("subtitle"), 180, BRAND.positioning);
  const logoSrc = await loadPublicAssetDataUrl(BRAND_ASSETS.logo);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background:
            "linear-gradient(145deg, #FAFAF7 0%, #F3F1EB 45%, #EDE9FE 100%)",
          color: "#0B1020",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <img
          src={logoSrc}
          height={96}
          alt=""
          style={{ objectFit: "contain", objectPosition: "left" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 26, color: "#4B5563", lineHeight: 1.4, maxWidth: 940 }}>
            {subtitle}
          </div>
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
