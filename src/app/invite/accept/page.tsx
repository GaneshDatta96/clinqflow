"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { getErrorMessage, readApiError } from "@/lib/api/client";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "ok" | "auth" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing invite token.");
      return;
    }

    fetch("/api/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          setStatus("auth");
          setMessage("Sign in with the invited email to accept.");
          return;
        }
        if (!res.ok) {
          throw await readApiError(res);
        }
        const data = await res.json();
        setStatus("ok");
        setMessage(data.message ?? "Invite accepted.");
        router.push("/app/dashboard");
        router.refresh();
      })
      .catch((e) => {
        setStatus("error");
        setMessage(getErrorMessage(e, "Request failed."));
      });
  }, [token, router]);

  return (
    <>
      {status === "loading" && (
        <p className="mt-4 inline-flex items-center gap-2 text-[color:var(--muted)]">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Verifying invite…
        </p>
      )}
      {status === "auth" && (
        <div className="mt-4 space-y-3">
          <p className="text-[color:var(--muted)]">{message}</p>
          <Link
            href={`/login?next=${encodeURIComponent(`/invite/accept?token=${token}`)}`}
            className="inline-flex rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      )}
      {status === "ok" && <p className="mt-4 text-green-700">{message}</p>}
      {status === "error" && <p className="mt-4 text-red-600">{message}</p>}
    </>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-6 py-20">
      <h1 className="text-2xl font-semibold">Accept invitation</h1>
      <Suspense
        fallback={
          <p className="mt-4 inline-flex items-center gap-2 text-[color:var(--muted)]">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Loading…
          </p>
        }
      >
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
