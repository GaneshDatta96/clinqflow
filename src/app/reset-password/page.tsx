import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { SkeletonAuthForm } from "@/components/ui/skeleton";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Choose a new password",
  description: "Set a new password for your CliniqFlow account.",
  path: "/reset-password",
  robots: NOINDEX_ROBOTS,
});

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="display-font text-3xl tracking-tight">Choose a new password</h1>
      <p className="mt-2 font-serif text-[color:var(--muted)]">
        Enter a new password for your CliniqFlow account.
      </p>
      <div className="mt-8">
        <Suspense fallback={<SkeletonAuthForm />}>
          <AuthForm mode="reset" />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        <Link href="/login" className="font-semibold text-[color:var(--accent)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
