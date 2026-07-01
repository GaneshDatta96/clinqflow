"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/db/supabase-browser";
import { Skeleton } from "@/components/ui/skeleton";

function MfaVerifySkeleton() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4" aria-busy aria-label="Loading MFA verification">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

export function PlatformMfaVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/app/admin";

  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFactor() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error: listError } = await supabase.auth.mfa.listFactors();

        if (listError) {
          throw listError;
        }

        const verifiedTotp =
          data?.totp?.find((factor) => factor.status === "verified") ?? null;

        if (!verifiedTotp) {
          router.replace(`/app/mfa/setup?next=${encodeURIComponent(nextPath)}`);
          return;
        }

        setFactorId(verifiedTotp.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load MFA factors.");
      } finally {
        setLoading(false);
      }
    }

    void loadFactor();
  }, [nextPath, router]);

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    if (!factorId) return;

    setPending(true);
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data: challenge, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError || !challenge) {
        throw challengeError ?? new Error("Could not start MFA challenge.");
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code: code.trim(),
      });

      if (verifyError) {
        throw verifyError;
      }

      router.push(nextPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code.");
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return <MfaVerifySkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
        Enter the 6-digit code from your authenticator app to continue to the
        platform console.
      </p>

      <form onSubmit={handleVerify} className="space-y-3">
        <label className="block">
          <span className="text-sm font-semibold">Verification code</span>
          <input
            className="mt-1 w-full rounded-xl border border-[color:var(--line)] px-4 py-3"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="123456"
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={pending || !factorId}
          className="w-full rounded-full bg-[color:var(--foreground)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Verifying…" : "Verify and continue"}
        </button>
      </form>
    </div>
  );
}
