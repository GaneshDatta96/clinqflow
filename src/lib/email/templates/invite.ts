import { ROLE_LABELS } from "@/lib/tenancy/role-routing";
import type { TenantRole } from "@/lib/tenancy/types";

export function buildInviteEmail(args: {
  organizationName: string;
  role: TenantRole;
  acceptUrl: string;
  inviterEmail?: string;
}) {
  const roleLabel = ROLE_LABELS[args.role] ?? args.role;

  const subject = `You're invited to ${args.organizationName} on Cliniqflow`;

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #0e7c7b;">Join ${args.organizationName}</h1>
      <p>You've been invited as <strong>${roleLabel}</strong> on Cliniqflow.</p>
      ${args.inviterEmail ? `<p>Invited by ${args.inviterEmail}</p>` : ""}
      <p>
        <a href="${args.acceptUrl}" style="display: inline-block; background: #0e7c7b; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">
          Accept invitation
        </a>
      </p>
      <p style="color: #61777d; font-size: 14px;">This link expires in 7 days. If you did not expect this email, you can ignore it.</p>
    </div>
  `;

  const text = `Join ${args.organizationName} on Cliniqflow as ${roleLabel}.\n\nAccept: ${args.acceptUrl}\n\nExpires in 7 days.`;

  return { subject, html, text };
}
