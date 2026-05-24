import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { sendEmail } from "@/lib/email/client";
import { buildInviteEmail } from "@/lib/email/templates/invite";
import type { TenantRole } from "@/lib/tenancy/types";

export async function sendInviteEmail(args: {
  tenantId: string;
  email: string;
  role: TenantRole;
  acceptUrl: string;
  inviterEmail?: string;
}) {
  const admin = getSupabaseAdmin();
  let organizationName = "your clinic";

  if (admin) {
    const { data: tenant } = await admin
      .from("tenants")
      .select("name")
      .eq("id", args.tenantId)
      .maybeSingle();
    if (tenant?.name) organizationName = tenant.name;
  }

  const template = buildInviteEmail({
    organizationName,
    role: args.role,
    acceptUrl: args.acceptUrl,
    inviterEmail: args.inviterEmail,
  });

  return sendEmail({
    to: args.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}
