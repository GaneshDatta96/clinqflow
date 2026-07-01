import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand/site";
import { BrandMarkImage } from "@/lib/brand/mark-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "CliniqFlow — patient intake and documentation workflow software for clinics";

export default function OpenGraphImage() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <BrandMarkImage size={96} radius={24} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.04em" }}>
              CliniqFlow
            </div>
            <div style={{ fontSize: 22, color: "#6B7280", maxWidth: 720, lineHeight: 1.4 }}>
              {BRAND.tagline}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#374151", maxWidth: 820, lineHeight: 1.5 }}>
          {BRAND.positioning}
        </div>
      </div>
    ),
    { ...size },
  );
}
