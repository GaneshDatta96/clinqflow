"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { SignupSuccessPanel } from "@/components/auth/signup-success-panel";
import { PasswordField } from "@/components/auth/password-field";
import { validatePassword } from "@/lib/auth/password";
import { createSupabaseBrowserClient } from "@/lib/db/supabase-browser";
import { getErrorMessage, readApiError } from "@/lib/api/client";

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
  const [signupComplete, setSignupComplete] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [resetSessionReady, setResetSessionReady] = useState(mode !== "reset");
  const [resetEmail, setResetEmail] = useState("");

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

      setResetEmail(user.email ?? "");
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
    setResendMessage(null);
    setResendPending(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw await readApiError(response);
      }
      const resentCopy =
        "Fresh verification email sent. Check your inbox and spam folder.";
      if (signupComplete) {
        setResendMessage(resentCopy);
      } else {
        setMessage(resentCopy);
      }
      setNeedsVerification(true);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to resend verification email."));
    } finally {
      setResendPending(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setResendMessage(null);
    setNeedsVerification(false);
    setPending(true);

    try {
      if (mode === "reset") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const passwordCheck = validatePassword(password, { email: resetEmail });
        if (!passwordCheck.valid) {
          throw new Error(passwordCheck.errors[0] ?? "Password is too weak.");
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
        if (!response.ok) {
          throw await readApiError(response);
        }
        setMessage("Check your email for a password reset link.");
        return;
      }

      if (mode === "signup") {
        const passwordCheck = validatePassword(password, { email });
        if (!passwordCheck.valid) {
          throw new Error(passwordCheck.errors[0] ?? "Password is too weak.");
        }

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
          }),
        });
        if (!response.ok) {
          throw await readApiError(response);
        }
        setSignupComplete(true);
        setNeedsVerification(true);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const apiError = await readApiError(response);
        const authMessage = apiError.message.toLowerCase();
        if (authMessage.includes("email not confirmed")) {
          setMessage(
            "Verify your email first — we sent a link when you signed up. Need a fresh one?",
          );
          setNeedsVerification(true);
          return;
        }
        throw apiError;
      }

      const payload = (await response.json()) as {
        emailConfirmed?: boolean;
      };

      if (!payload.emailConfirmed) {
        setMessage(
          "Verify your email first — we sent a link when you signed up. Need a fresh one?",
        );
        setNeedsVerification(true);
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        return;
      }

      const roleRes = await fetch("/api/auth/session-role");
      if (!roleRes.ok) {
        const roleError = await readApiError(roleRes);
        setError(roleError.message);
        router.push("/app/dashboard");
        router.refresh();
        return;
      }
      const roleData = (await roleRes.json()) as {
        path?: string;
        mfaRedirect?: string | null;
      };

      if (roleData.mfaRedirect) {
        router.push(roleData.mfaRedirect);
        router.refresh();
        return;
      }

      router.push(roleData.path ?? "/app/dashboard");
      router.refresh();
      return;
    } catch (err) {
      setError(getErrorMessage(err, "Authentication failed."));
    } finally {
      setPending(false);
    }
  }

  if (mode === "signup" && signupComplete) {
    return (
      <SignupSuccessPanel
        email={email}
        fullName={fullName}
        resendPending={resendPending}
        resendMessage={resendMessage}
        onResend={handleResendVerification}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
      {mode === "signup" && (
        <label className="block">
          <span className="text-sm font-semibold">Full name</span>
          <input
            className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/15"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />
        </label>
      )}
      {mode !== "reset" && (
        <label className="block">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            className="mt-1.5 w-full rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/15"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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
        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          email={email}
          showStrength
          hint="At least 8 characters with upper & lower case, a number, and good complexity."
        />
      )}
      {mode === "reset" && resetSessionReady && (
        <PasswordField
          label="New password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          email={resetEmail}
          showStrength
        />
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
      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && <p className="text-sm text-green-700">{message}</p>}
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
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent)] py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            {mode === "signup" ? "Creating your account…" : "Please wait…"}
          </>
        ) : mode === "login" ? (
          "Sign in"
        ) : mode === "signup" ? (
          "Create account"
        ) : mode === "reset" ? (
          "Update password"
        ) : (
          "Send reset link"
        )}
      </button>
      )}
    </form>
  );
}
