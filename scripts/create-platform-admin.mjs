/**
 * One-time: create or update platform admin auth user.
 * Usage (password never stored in repo):
 *   PLATFORM_ADMIN_PASSWORD='your-password' npm run create:platform-admin
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnvFile(relativePath) {
  if (!existsSync(relativePath)) return;
  const text = readFileSync(relativePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = (process.env.PLATFORM_ADMIN_EMAILS ?? "")
  .split(",")[0]
  ?.trim()
  .toLowerCase();
const password = process.env.PLATFORM_ADMIN_PASSWORD;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

if (!email) {
  console.error("Set PLATFORM_ADMIN_EMAILS in .env first");
  process.exit(1);
}

if (!password || password.length < 8) {
  console.error(
    "Set PLATFORM_ADMIN_PASSWORD for this run only (min 8 chars), e.g.:\n" +
      "  $env:PLATFORM_ADMIN_PASSWORD='...'; npm run create:platform-admin",
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
const existing = list?.users?.find(
  (u) => u.email?.toLowerCase() === email,
);

let userId;

if (existing) {
  const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("Update user failed:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log(`Updated existing user ${email}`);
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Platform Admin" },
  });
  if (error) {
    console.error("Create user failed:", error.message);
    process.exit(1);
  }
  userId = data.user.id;
  console.log(`Created user ${email}`);
}

const { error: profileError } = await admin.from("profiles").upsert(
  {
    id: userId,
    email,
    full_name: "Platform Admin",
    is_platform_admin: true,
    updated_at: new Date().toISOString(),
  },
  { onConflict: "id" },
);

if (profileError) {
  console.error("Profile update failed:", profileError.message);
  process.exit(1);
}

console.log("Platform admin ready. Log in at /login → /app/admin");
