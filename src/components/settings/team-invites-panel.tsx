"use client";

import { useEffect, useState, useTransition } from "react";
import { LoaderCircle, Mail } from "lucide-react";

type Invite = {
  id: string;
  email: string;
  role: string;
  expires_at: string;
  accepted_at: string | null;
};

export function TeamInvitesPanel() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function loadInvites() {
    fetch("/api/invites")
      .then((r) => r.json())
      .then((d) => setInvites(d.invites ?? []))
      .catch(() => setError("Failed to load invites."));
  }

  useEffect(() => {
    loadInvites();
  }, []);

  function sendInvite(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      setError(null);
      setLastUrl(null);
      try {
        const res = await fetch("/api/invites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed to send invite");
        setLastUrl(data.acceptUrl ?? null);
        setEmail("");
        loadInvites();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed");
      }
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/80 p-6">
      <h2 className="text-xl font-semibold">Team invites</h2>
      <form onSubmit={sendInvite} className="flex flex-wrap gap-3">
        <input
          type="email"
          placeholder="colleague@clinic.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="min-w-[200px] flex-1 rounded-xl border px-4 py-2.5"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded-xl border px-4 py-2.5"
        >
          <option value="admin">Admin</option>
          <option value="practitioner">Practitioner</option>
          <option value="staff">Staff</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          Invite
        </button>
      </form>
      {lastUrl && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Share this link:{" "}
          <a href={lastUrl} className="break-all font-semibold underline">
            {lastUrl}
          </a>
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="divide-y divide-[color:var(--line)]">
        {invites.map((inv) => (
          <li key={inv.id} className="flex justify-between py-3 text-sm">
            <span>
              {inv.email} · <span className="capitalize">{inv.role}</span>
            </span>
            <span className="text-[color:var(--muted)]">
              {inv.accepted_at ? "Accepted" : "Pending"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
