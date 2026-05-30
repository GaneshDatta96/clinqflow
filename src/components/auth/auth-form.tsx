"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/db/supabase-browser";

type AuthMode = "login" | "signup" | "forgot";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);

  async function handleResendVerification() {
    if (!email.trim()) {
      setError("Enter your email address first.");
      return;
    }

    setError(null);
    setResendPending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to resend verification email.");
      }
      setMessage("Verification email sent again. Check your inbox and spam folder.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to resend verification email.");
    } finally {
      setResendPending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);

    try {
      if (mode === "forgot") {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to send reset email.");
        }
        setMessage("Check your email for a password reset link.");
        return;
      }

      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
          }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Unable to create account.");
        }
        setMessage(
          "Account created. Check your email to verify your address, then continue to onboarding.",
        );
        return;
      }

      const supabase = createSupabaseBrowserClient();

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (signInError) throw signInError;

      if (!signInData.user?.email_confirmed_at) {
        setMessage("Please verify your email before signing in.");
        await supabase.auth.signOut();
        return;
      }

      const roleRes = await fetch("/api/auth/session-role");
      const roleData = await roleRes.json();
      router.push(roleData.path ?? "/app/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
      {mode === "signup" && (
        <label className="block">
          <span className="text-sm font-semibold">Full name</span>
          <input
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
      )}
      <label className="block">
        <span className="text-sm font-semibold">Email</span>
        <input
          type="email"
          className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      {mode !== "forgot" && (
        <label className="block">
          <span className="text-sm font-semibold">Password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}
      {mode === "signup" && message ? (
        <button
          type="button"
          disabled={resendPending || !email.trim()}
          onClick={handleResendVerification}
          className="w-full rounded-full border border-[color:var(--line)] py-3 text-sm font-semibold disabled:opacity-60"
        >
          {resendPending ? "Sending…" : "Resend verification email"}
        </button>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[color:var(--accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : mode === "signup"
              ? "Create account"
              : "Send reset link"}
      </button>
    </form>
  );
}
