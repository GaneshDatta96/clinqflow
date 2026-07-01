import { ImageResponse } from "next/og";
import { BRAND_ASSETS } from "@/lib/brand/site";
import { loadPublicAssetDataUrl } from "@/lib/brand/load-asset";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
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
        <img src={src} width={28} height={28} alt="" style={{ objectFit: "contain" }} />
      </div>
    ),
    { ...size },
  );
}
