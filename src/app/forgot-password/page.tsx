import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Reset password</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        We will email you a secure link to reset your password.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-[color:var(--muted)]">Loading…</p>}>
          <AuthForm mode="forgot" />
        </Suspense>
      </div>
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-[color:var(--accent)]">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
