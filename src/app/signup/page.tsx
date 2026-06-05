import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign up",
  description: "Create your CliniqFlow clinic account.",
  path: "/signup",
  robots: NOINDEX_ROBOTS,
});

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Create your clinic workspace, then subscribe to a plan.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-[color:var(--muted)]">Loading…</p>}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-xs leading-6 text-[color:var(--muted)]">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="font-semibold text-[color:var(--accent)]">
          Terms of Service
        </Link>
        ,{" "}
        <Link href="/terms-of-use" className="font-semibold text-[color:var(--accent)]">
          Terms of Use
        </Link>
        ,{" "}
        <Link href="/acceptable-use" className="font-semibold text-[color:var(--accent)]">
          Acceptable Use Policy
        </Link>
        ,{" "}
        <Link href="/ai-disclaimer" className="font-semibold text-[color:var(--accent)]">
          AI Disclaimer
        </Link>
        , and{" "}
        <Link href="/privacy" className="font-semibold text-[color:var(--accent)]">
          Privacy Policy
        </Link>
        .
      </p>
      <p className="mt-4 text-center text-sm text-[color:var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[color:var(--accent)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
