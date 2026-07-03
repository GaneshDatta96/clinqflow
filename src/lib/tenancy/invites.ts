import { createHash, randomBytes } from "node:crypto";
import { after } from "next/server";
import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import { badRequest, forbidden, notFound } from "@/lib/api/errors";
import { assertSeatAvailable } from "@/lib/billing/entitlements";
import { authUrl } from "@/lib/routing/zones";
import type { TenantRole } from "@/lib/tenancy/types";

const INVITE_TTL_DAYS = 7;

export function hashInviteToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateInviteToken() {
  return randomBytes(32).toString("base64url");
}

export async function createTenantInvite(args: {
  tenantId: string;
  email: string;
  role: TenantRole;
  invitedBy: string;
}) {
  await assertSeatAvailable(args.tenantId);

  const admin = getSupabaseAdmin();
  if (!admin) {
    throw badRequest("Database not configured.");
  }

  const email = args.email.trim().toLowerCase();
  const rawToken = generateInviteToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_TTL_DAYS);

  const [insertResult, inviterProfileResult] = await Promise.all([
    admin
      .from("tenant_invites")
      .insert({
        tenant_id: args.tenantId,
        email,
        role: args.role,
        token_hash: hashInviteToken(rawToken),
        invited_by: args.invitedBy,
        expires_at: expiresAt.toISOString(),
      })
      .select("id, email, role, expires_at")
      .single(),
    admin.from("profiles").select("email").eq("id", args.invitedBy).maybeSingle(),
  ]);

  const { data, error } = insertResult;

  if (error || !data) {
    throw error ?? badRequest("Unable to create invite.");
  }

  const acceptUrl = authUrl(
    `/invite/accept?token=${encodeURIComponent(rawToken)}`,
  );

  await admin.from("audit_logs").insert({
    tenant_id: args.tenantId,
    actor_id: args.invitedBy,
    action: "invite.created",
    resource_type: "tenant_invite",
    resource_id: data.id,
    metadata: { email, role: args.role },
  });

  const { sendInviteEmail } = await import("@/lib/email/send-invite");
  const inviterEmail = inviterProfileResult.data?.email ?? undefined;

  after(async () => {
    try {
      await sendInviteEmail({
        tenantId: args.tenantId,
        email,
        role: args.role,
        acceptUrl,
        inviterEmail,
      });
    } catch (emailError) {
      console.error("[invite] email failed", emailError);
    }
  });

  return { invite: data, acceptUrl, rawToken };
}

export async function acceptTenantInvite(args: {
  rawToken: string;
  userId: string;
  userEmail: string;
}) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    throw badRequest("Database not configured.");
  }

  const tokenHash = hashInviteToken(args.rawToken);
  const email = args.userEmail.trim().toLowerCase();

  const { data: invite, error } = await admin
    .from("tenant_invites")
    .select("id, tenant_id, email, role, expires_at, accepted_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (error || !invite) {
    throw notFound("Invite not found or expired.");
  }

  if (invite.accepted_at) {
    throw badRequest("This invite was already accepted.");
  }

  if (new Date(invite.expires_at) < new Date()) {
    throw badRequest("This invite has expired.");
  }

  if (invite.email !== email) {
    throw forbidden(
      "This invite was sent to a different email address. Sign in with the invited email.",
    );
  }

  const { data: existing } = await admin
    .from("tenant_memberships")
    .select("id")
    .eq("tenant_id", invite.tenant_id)
    .eq("user_id", args.userId)
    .maybeSingle();

  if (!existing) {
    await assertSeatAvailable(invite.tenant_id);

    const { error: memberError } = await admin.from("tenant_memberships").insert({
      tenant_id: invite.tenant_id,
      user_id: args.userId,
      role: invite.role,
      invited_by: null,
      accepted_at: new Date().toISOString(),
    });

    if (memberError) {
      throw memberError;
    }
  }

  await admin
    .from("tenant_invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);

  await admin.from("audit_logs").insert({
    tenant_id: invite.tenant_id,
    actor_id: args.userId,
    action: "invite.accepted",
    resource_type: "tenant_invite",
    resource_id: invite.id,
  });

  return { tenantId: invite.tenant_id };
}
