import { ImageResponse } from "next/og";
import { BRAND_ASSETS } from "@/lib/brand/site";
import { loadPublicAssetDataUrl } from "@/lib/brand/load-asset";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const src = await loadPublicAssetDataUrl(BRAND_ASSETS.mark);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <img src={src} width={156} height={156} alt="" style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size },
  );
}
