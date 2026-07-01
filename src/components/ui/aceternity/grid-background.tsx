import { cn } from "@/lib/utils";

export function GridBackground({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]",
          className,
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[color:var(--background)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      />
      {children}
    </div>
  );
}
