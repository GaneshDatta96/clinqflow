import { ImageResponse } from "next/og";
import { BRAND, BRAND_ASSETS } from "@/lib/brand/site";
import { loadPublicAssetDataUrl } from "@/lib/brand/load-asset";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CliniqFlow — patient intake and documentation workflow software for clinics";

export default async function OpenGraphImage() {
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
          background: "linear-gradient(145deg, #FAFAF7 0%, #F3F1EB 45%, #EDE9FE 100%)",
          color: "#0B1020",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <img src={logoSrc} height={120} alt="" style={{ objectFit: "contain", objectPosition: "left" }} />
        <div style={{ fontSize: 22, color: "#374151", maxWidth: 820, lineHeight: 1.5 }}>
          {BRAND.positioning}
        </div>
      </div>
    ),
    { ...size },
  );
}
