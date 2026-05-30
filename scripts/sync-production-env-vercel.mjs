/**
 * Sync critical production env vars from local .env + preview Upstash.
 * Usage: node --env-file-if-exists=.env scripts/sync-production-env-vercel.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectId = "prj_lFDDw6KP1mUNgkluGLCRz4lryKQg";
const teamId = "team_507Kq4C2wEBwhJiZpZL3DVkp";

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const values = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\n/)) {
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
    values[key] = value;
  }
  return values;
}

function readVercelToken() {
  const authPath = path.join(
    os.homedir(),
    "AppData/Roaming/xdg.data/com.vercel.cli/auth.json",
  );
  return JSON.parse(fs.readFileSync(authPath, "utf8")).token;
}

async function vercelFetch(url, token, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${url}: ${text}`);
  }
  return text ? JSON.parse(text) : null;
}

async function getDecryptedEnv(token, key, target) {
  const query = `?teamId=${teamId}&decrypt=true`;
  const list = await vercelFetch(
    `https://api.vercel.com/v9/projects/${projectId}/env${query.replace("&decrypt=true", "")}`,
    token,
  );
  const row = (list.envs ?? []).find(
    (entry) =>
      entry.key === key &&
      (target ? entry.target?.includes(target) : true),
  );
  if (!row) {
    return null;
  }
  const detail = await vercelFetch(
    `https://api.vercel.com/v9/projects/${projectId}/env/${row.id}${query}`,
    token,
  );
  return detail.value ?? null;
}

async function upsertProductionEnv(token, key, value) {
  const query = `?teamId=${teamId}`;
  const list = await vercelFetch(
    `https://api.vercel.com/v9/projects/${projectId}/env${query}`,
    token,
  );

  for (const row of (list.envs ?? []).filter(
    (entry) => entry.key === key && entry.target?.includes("production"),
  )) {
    await vercelFetch(
      `https://api.vercel.com/v9/projects/${projectId}/env/${row.id}${query}`,
      token,
      { method: "DELETE" },
    );
  }

  await vercelFetch(
    `https://api.vercel.com/v10/projects/${projectId}/env${query}`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: ["production"],
      }),
    },
  );

  console.log(`Synced ${key} (${value.length} chars)`);
}

async function main() {
  const token = readVercelToken();
  const local = readEnvFile(path.join(process.cwd(), ".env"));

  const keys = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "APP_URL",
    "INTAKE_TOKEN_SECRET",
    "CRON_SECRET",
    "PLATFORM_ADMIN_EMAILS",
  ];

  for (const key of keys) {
    if (!local[key]) {
      console.warn(`Skip ${key} — missing in local .env`);
      continue;
    }
    await upsertProductionEnv(token, key, local[key]);
  }

  for (const key of ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"]) {
    const previewValue = await getDecryptedEnv(token, key, "preview");
    if (!previewValue) {
      console.warn(`Skip ${key} — missing preview value`);
      continue;
    }
    await upsertProductionEnv(token, key, previewValue);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
