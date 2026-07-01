/** Shared CliniqFlow mark for next/og ImageResponse (favicon, apple-icon, OG). */

export function BrandMarkImage({
  size,
  radius,
}: {
  size: number;
  radius: number;
}) {
  const markSize = Math.round(size * 0.52);

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B1020",
        borderRadius: radius,
      }}
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M4 14C8 10 10 6 12 6"
          stroke="#7C3AED"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M6 17C11 12 12 8 16 7"
          stroke="#A78BFA"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M8 20C14 14 15 10 19 9"
          stroke="#EC4899"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="12" cy="6" r="2.2" fill="#7C3AED" />
      </svg>
    </div>
  );
}
