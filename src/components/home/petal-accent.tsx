/** Subtle petal + orbit motif — recurring brand language, not decoration noise. */
export function PetalAccent({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={className}
    >
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.5" />
      <path
        d="M24 10 C24 10 28 16 28 24 C28 32 24 38 24 38 C24 38 20 32 20 24 C20 16 24 10 24 10Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
      <path
        d="M10 24 C10 24 16 20 24 20 C32 20 38 24 38 24 C38 24 32 28 24 28 C16 28 10 24 10 24Z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />
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
