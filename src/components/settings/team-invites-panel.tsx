"use client";

import { LoaderCircle, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { ROLE_LABELS } from "@/lib/tenancy/role-routing";
import { getErrorMessage } from "@/lib/api/client";
import { useInvites, useSendInvite } from "@/lib/query/hooks";
import { SkeletonInvitePanel } from "@/components/ui/skeleton";
import { AnimatedTooltipHint } from "@/components/ui/aceternity";
import { EmptyState } from "@/components/ui/empty-state";

export function TeamInvitesPanel() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: invites = [], isLoading } = useInvites();
  const sendInvite = useSendInvite();

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    sendInvite.mutate(
      { email, role },
      {
        onSuccess: (data) => {
          setSuccessMessage(
            data.emailSent
              ? "Invite emailed to the recipient."
              : "Invite created. Configure email delivery to send accept links automatically.",
          );
          setEmail("");
        },
        onError: (e) => {
          setError(getErrorMessage(e, "Request failed"));
        },
      },
    );
  }

  if (isLoading) {
    return <SkeletonInvitePanel />;
  }

  return (
    <section className="space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/80 p-6">
      <h2 className="display-font text-xl">Team invites</h2>
      <p className="font-serif text-sm text-[color:var(--muted)]">
        Invites are sent by email when Zoho SMTP or SendGrid is configured. Accept links
        are not returned in the API response.
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-3">
        <label className="min-w-[200px] flex-1">
          <span className="caption mb-1.5 block">Email</span>
          <input
            type="email"
            placeholder="colleague@clinic.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-2.5"
          />
        </label>
        <label>
          <span className="caption mb-1.5 flex items-center gap-1.5">
            Role
            <AnimatedTooltipHint label="Admins manage billing. Practitioners review encounters. Staff coordinate intake.">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[color:var(--line)] text-[10px] font-bold text-[color:var(--muted)]">
                ?
              </span>
            </AnimatedTooltipHint>
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-xl border px-4 py-2.5"
          >
            <option value="admin">Clinic administrator</option>
            <option value="practitioner">Practitioner</option>
            <option value="staff">Staff</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={sendInvite.isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-white"
        >
          {sendInvite.isPending ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          Invite
        </button>
      </form>
      {successMessage && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          {successMessage}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}
      {invites.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No pending invites"
          description="Invite administrators, practitioners, or staff to your clinic workspace."
        />
      ) : (
        <ul className="divide-y rounded-xl border">
          {invites.map((invite) => (
            <li key={invite.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <span>{invite.email}</span>
              <span className="text-[color:var(--muted)]">
                {ROLE_LABELS[invite.role as keyof typeof ROLE_LABELS] ?? invite.role}
                {invite.accepted_at ? " · accepted" : " · pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
