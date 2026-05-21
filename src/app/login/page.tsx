import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Access your clinic workspace, encounters, and intake queue.
      </p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        No account?{" "}
        <Link href="/signup" className="font-semibold text-[color:var(--accent)]">
          Create one
        </Link>
      </p>
    </div>
  );
}
