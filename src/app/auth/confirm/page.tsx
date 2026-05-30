"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/db/supabase-browser";

/** Fallback for older Supabase links that redirect with tokens in the URL hash. */
export default function AuthConfirmPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function completeAuth() {
      const supabase = createSupabaseBrowserClient();
      const hash = window.location.hash.replace(/^#/, "");

      if (hash) {
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setError(sessionError.message);
            return;
          }

          const roleRes = await fetch("/api/auth/session-role");
          const roleData = (await roleRes.json()) as { path?: string };
          router.replace(roleData.path ?? "/app/dashboard");
          router.refresh();
          return;
        }
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        window.location.replace(`/auth/callback?code=${encodeURIComponent(code)}`);
        return;
      }

      setError("This confirmation link is invalid or has expired.");
    }

    void completeAuth();
  }, [router]);

  return (
    <div className="mx-auto flex min-h-[40vh] max-w-md flex-col justify-center px-6 py-16 text-center">
      {error ? (
        <>
          <p className="text-sm text-red-600">{error}</p>
          <Link href="/login" className="mt-4 text-sm font-semibold text-[color:var(--accent)]">
            Back to sign in
          </Link>
        </>
      ) : (
        <p className="text-[color:var(--muted)]">Confirming your email…</p>
      )}
    </div>
  );
}
