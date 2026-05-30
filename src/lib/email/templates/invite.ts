import { ROLE_LABELS } from "@/lib/tenancy/role-routing";
import type { TenantRole } from "@/lib/tenancy/types";
import { emailShell } from "@/lib/email/templates/shared";

export function buildInviteEmail(args: {
  organizationName: string;
  role: TenantRole;
  acceptUrl: string;
  inviterEmail?: string;
}) {
  const roleLabel = ROLE_LABELS[args.role] ?? args.role;
  const subject = `${args.organizationName} saved you a seat`;

  const lines = [
    `You've been invited to join <strong>${args.organizationName}</strong> on CliniqFlow as <strong>${roleLabel}</strong>.`,
    args.inviterEmail
      ? `${args.inviterEmail} thinks you'll make the front desk calmer.`
      : "Your team thinks you'll make the front desk calmer.",
    "Accept below and skip the \"what's the login again?\" thread.",
  ];

  const { html, text } = emailShell({
    title: "You're on the guest list",
    lines,
    ctaLabel: "Join the workspace",
    ctaUrl: args.acceptUrl,
    footer: "Link expires in 7 days. Wrong inbox? Ignore this.",
  });

  return { subject, html, text };
}
