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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);

    try {
      const supabase = createSupabaseBrowserClient();

      if (mode === "forgot") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          { redirectTo: `${window.location.origin}/auth/callback?type=recovery` },
        );
        if (resetError) throw resetError;
        setMessage("Check your email for a password reset link.");
        return;
      }

      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setMessage(
          "Account created. Check your email to verify your address, then continue to onboarding.",
        );
        return;
      }

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
      {mode === "login" && (
        <p className="rounded-xl bg-[color:var(--surface-strong)] px-4 py-3 text-xs text-[color:var(--muted-strong)]">
          Clinic roles: owner/admin, practitioner, staff, viewer. Cliniqflow internal
          roles: customer support (<code>PLATFORM_SUPPORT_EMAILS</code>) and God mode (
          <code>PLATFORM_ADMIN_EMAILS</code>).
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-700">{message}</p>}
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
