import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { SkeletonAuthForm } from "@/components/ui/skeleton";
import { GridBackground } from "@/components/ui/aceternity";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign in",
  description: "Sign in to your CliniqFlow clinic workspace.",
  path: "/login",
  robots: NOINDEX_ROBOTS,
});

export default function LoginPage() {
  return (
    <GridBackground containerClassName="flex-1">
    <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="display-font text-3xl tracking-tight">Sign in</h1>
      <p className="mt-2 font-serif text-[color:var(--muted)]">
        Access your clinic workspace, encounters, and intake queue.
      </p>
      <div className="mt-8">
        <Suspense fallback={<SkeletonAuthForm />}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        <Link href="/forgot-password" className="font-semibold text-[color:var(--accent)]">
          Forgot your password?
        </Link>
      </p>
      <p className="mt-3 text-center text-sm text-[color:var(--muted)]">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-[color:var(--accent)]">
          Create one
        </Link>
      </p>
    </div>
    </GridBackground>
  );
}
