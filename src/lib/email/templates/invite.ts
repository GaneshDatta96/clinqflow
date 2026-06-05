import { ROLE_LABELS } from "@/lib/tenancy/role-routing";
import type { TenantRole } from "@/lib/tenancy/types";
import { emailShell } from "@/lib/email/templates/shared";

function roleInviteContext(role: TenantRole) {
  switch (role) {
    case "owner":
      return "You'll have full ownership of the workspace, including billing, team access, and clinic settings.";
    case "admin":
      return "You'll help run the clinic workspace — managing team access, settings, and day-to-day operations.";
    case "practitioner":
      return "You'll review patient intake, encounter context, and documentation drafts before appointments begin.";
    case "staff":
      return "You'll support intake coordination, patient links, and the operational flow across the clinic.";
    case "viewer":
      return "You'll have read-only access to clinic activity and encounter context when you need visibility without editing.";
    default:
      return "You'll join the clinic workspace with the access your team has assigned to you.";
  }
}

export function buildInviteEmail(args: {
  organizationName: string;
  role: TenantRole;
  acceptUrl: string;
  inviterEmail?: string;
}) {
  const roleLabel = ROLE_LABELS[args.role] ?? args.role;
  const subject = `You're invited to ${args.organizationName} on CliniqFlow`;

  const inviterLine = args.inviterEmail
    ? `<strong>${args.inviterEmail}</strong> has invited you to join their clinic on CliniqFlow.`
    : "Your clinic team has invited you to join them on CliniqFlow.";

  const lines = [
    inviterLine,
    `You'll be joining <strong>${args.organizationName}</strong> as <strong>${roleLabel}</strong>.`,
    roleInviteContext(args.role),
    "CliniqFlow helps clinics collect structured pre-visit intake and prepare review-first documentation — so practitioners walk into appointments with clearer context and less operational noise.",
    "Accept the invitation below to claim your seat and step into a calmer workflow.",
  ];

  const { html, text } = emailShell({
    title: "Join your clinic workspace",
    preheader: `${args.organizationName} invited you to collaborate on CliniqFlow as ${roleLabel}.`,
    lines,
    ctaLabel: "Accept invitation",
    ctaUrl: args.acceptUrl,
    footer: "This invitation expires in 7 days. If you weren't expecting it, you can safely ignore this email.",
  });

  return { subject, html, text };
}
