import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignupPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Start a 14-day trial for your clinic team.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[color:var(--accent)]">
          Sign in
        </Link>
      </p>
    </div>
  );
}
