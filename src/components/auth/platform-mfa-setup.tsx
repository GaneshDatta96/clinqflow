"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/db/supabase-browser";
import { Skeleton } from "@/components/ui/skeleton";

function MfaSetupSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md space-y-4" aria-busy aria-label="Preparing MFA setup">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="mx-auto h-[232px] w-[232px] rounded-2xl" />
      <Skeleton className="h-11 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  );
}

export function PlatformMfaSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/app/admin";

  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function enroll() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: "totp",
          friendlyName: "Authenticator app",
        });

        if (enrollError || !data) {
          throw enrollError ?? new Error("Could not start MFA enrollment.");
        }

        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not start MFA enrollment.");
      } finally {
        setLoading(false);
      }
    }

    void enroll();
  }, []);

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
    return <MfaSetupSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <p className="text-sm leading-6 text-[color:var(--muted-strong)]">
        Platform staff must enable an authenticator app before accessing the admin
        console. Scan the QR code with Google Authenticator, 1Password, or a similar
        app, then enter the 6-digit code.
      </p>

      <div
        className="mx-auto flex h-[232px] w-[232px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-white p-4"
        aria-label="Authenticator QR code"
      >
        {qrCode ? (
          <div
            className="flex h-[200px] w-[200px] items-center justify-center [&_svg]:h-full [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrCode }}
          />
        ) : (
          <Skeleton className="h-[200px] w-[200px] rounded-xl" />
        )}
      </div>

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
          {pending ? "Verifying…" : "Enable MFA"}
        </button>
      </form>
    </div>
  );
}
