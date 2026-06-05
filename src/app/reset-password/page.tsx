import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Choose a new password</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Enter a new password for your CliniqFlow account.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-[color:var(--muted)]">Loading…</p>}>
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
