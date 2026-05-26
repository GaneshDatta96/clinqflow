/** Subtle petal + orbit motif — recurring brand language, not decoration noise. */
export function PetalAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 48"
      fill="none"
      aria-hidden
      className={className}
    >
      <ellipse
        cx="18"
        cy="16"
        rx="6"
        ry="10"
        transform="rotate(-18 18 16)"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.34"
      />
      <ellipse
        cx="14"
        cy="24"
        rx="5.5"
        ry="9.5"
        transform="rotate(88 14 24)"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.28"
      />
      <ellipse
        cx="18"
        cy="32"
        rx="6"
        ry="10"
        transform="rotate(18 18 32)"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.34"
      />
      <circle cx="25" cy="24" r="2.8" fill="currentColor" opacity="0.62" />
      <path
        d="M28 24C34 20 39 17 45 17C50 17 53 20 56 24C53 28 50 31 45 31C39 31 34 28 28 24Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.24"
      />
      <path
        d="M32 16C37 15 41 17 45 20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.32"
      />
      <path
        d="M32 32C37 33 41 31 45 28"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.32"
      />
      <circle cx="38" cy="16" r="1.8" fill="currentColor" opacity="0.38" />
      <circle cx="47" cy="24" r="2.3" fill="currentColor" opacity="0.52" />
      <circle cx="56" cy="24" r="1.8" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

export function GradientRule({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-[color:var(--gradient-mid)] to-transparent opacity-60 ${className}`}
    />
  );
}
