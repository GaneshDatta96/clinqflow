"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/db/supabase-browser";

type AuthMode = "login" | "signup" | "forgot" | "reset";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resetSessionReady, setResetSessionReady] = useState(mode !== "reset");

  useEffect(() => {
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(urlError);
    }
  }, [searchParams]);

  useEffect(() => {
    if (mode !== "reset") return;

    async function verifyResetSession() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("This reset link is invalid or has expired. Request a new one.");
        setResetSessionReady(false);
        return;
      }

      setResetSessionReady(true);
    }

    void verifyResetSession();
  }, [mode]);

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
      setNeedsVerification(true);
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
    setNeedsVerification(false);
    setPending(true);

    try {
      if (mode === "reset") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const supabase = createSupabaseBrowserClient();
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });

        if (updateError) {
          throw updateError;
        }

        setMessage("Password updated. You can sign in with your new password.");
        router.push("/login");
        router.refresh();
        return;
      }

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
          "Account created. Check your email to verify your address, then sign in.",
        );
        setNeedsVerification(true);
        return;
      }

      const supabase = createSupabaseBrowserClient();

      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        const authMessage = signInError.message.toLowerCase();
        if (authMessage.includes("email not confirmed")) {
          setMessage(
            "Verify your email first — we sent a link when you signed up. Need a fresh one?",
          );
          setNeedsVerification(true);
          return;
        }
        throw signInError;
      }

      if (!signInData.user?.email_confirmed_at) {
        setMessage(
          "Verify your email first — we sent a link when you signed up. Need a fresh one?",
        );
        setNeedsVerification(true);
        await supabase.auth.signOut();
        return;
      }

      const roleRes = await fetch("/api/auth/session-role");
      const roleData = await roleRes.json().catch(() => ({}));
      if (!roleRes.ok) {
        setError(
          typeof roleData.error === "string"
            ? roleData.error
            : "Could not resolve your workspace role. Try again.",
        );
        router.push("/app/dashboard");
        router.refresh();
        return;
      }
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
      {mode !== "reset" && (
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
      )}
      {mode === "login" && (
        <label className="block">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Password</span>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[color:var(--accent)]"
            >
              Forgot password?
            </Link>
          </div>
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
      {mode === "signup" && (
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
      {mode === "reset" && resetSessionReady && (
        <label className="block">
          <span className="text-sm font-semibold">New password</span>
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
      {mode === "reset" && resetSessionReady && (
        <label className="block">
          <span className="text-sm font-semibold">Confirm new password</span>
          <input
            type="password"
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
      )}
      {mode === "reset" && !resetSessionReady && (
        <Link
          href="/forgot-password"
          className="block w-full rounded-full border border-[color:var(--line)] py-3 text-center text-sm font-semibold"
        >
          Request a new reset link
        </Link>
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
      {mode === "login" && needsVerification ? (
        <button
          type="button"
          disabled={resendPending || !email.trim()}
          onClick={handleResendVerification}
          className="w-full rounded-full border border-[color:var(--line)] py-3 text-sm font-semibold disabled:opacity-60"
        >
          {resendPending ? "Sending…" : "Resend verification email"}
        </button>
      ) : null}
      {(mode !== "reset" || resetSessionReady) && (
      <button
        type="submit"
        disabled={pending || (mode === "reset" && !resetSessionReady)}
        className="w-full rounded-full bg-[color:var(--accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : mode === "signup"
              ? "Create account"
              : mode === "reset"
                ? "Update password"
                : "Send reset link"}
      </button>
      )}
    </form>
  );
}
