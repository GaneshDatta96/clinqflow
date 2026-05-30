/**
 * Upload ZOHO_ACCOUNTS_JSON to Vercel (production/preview/development).
 * Usage: node --env-file-if-exists=.env scripts/push-zoho-env-vercel.mjs
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const projectId = "prj_lFDDw6KP1mUNgkluGLCRz4lryKQg";
const teamId = "team_507Kq4C2wEBwhJiZpZL3DVkp";

function readZohoJsonFromEnvFile() {
  const envPath = path.join(process.cwd(), ".env");
  const line = fs
    .readFileSync(envPath, "utf8")
    .split(/\n/)
    .find((entry) => entry.startsWith("ZOHO_ACCOUNTS_JSON="));
  if (!line) {
    throw new Error("ZOHO_ACCOUNTS_JSON missing from .env");
  }

  const quoted = line.match(/^ZOHO_ACCOUNTS_JSON='(.+)'$/);
  if (quoted) {
    return quoted[1];
  }

  return line
    .replace(/^ZOHO_ACCOUNTS_JSON=/, "")
    .trim()
    .replace(/^'|'$/g, "");
}

function readVercelToken() {
  const authPath = path.join(
    os.homedir(),
    "AppData/Roaming/xdg.data/com.vercel.cli/auth.json",
  );
  const auth = JSON.parse(fs.readFileSync(authPath, "utf8"));
  if (!auth.token) {
    throw new Error("Vercel auth token not found");
  }
  return auth.token;
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
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`${response.status} ${url}: ${text}`);
  }

  return json;
}

async function main() {
  const token = readVercelToken();
  const zohoJson = readZohoJsonFromEnvFile();
  JSON.parse(zohoJson);
  console.log(`Local ZOHO JSON length: ${zohoJson.length}`);

  const query = `?teamId=${teamId}`;
  const listUrl = `https://api.vercel.com/v9/projects/${projectId}/env${query}`;
  const existing = await vercelFetch(listUrl, token);
  const matches = (existing.envs ?? []).filter(
    (entry) => entry.key === "ZOHO_ACCOUNTS_JSON",
  );

  for (const entry of matches) {
    console.log(`Deleting ${entry.id} (${entry.target?.join(", ")})`);
    await vercelFetch(
      `https://api.vercel.com/v9/projects/${projectId}/env/${entry.id}${query}`,
      token,
      { method: "DELETE" },
    );
  }

  const created = await vercelFetch(
    `https://api.vercel.com/v10/projects/${projectId}/env${query}`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        key: "ZOHO_ACCOUNTS_JSON",
        value: zohoJson,
        type: "encrypted",
        target: ["production", "preview", "development"],
      }),
    },
  );

  console.log(`Created env var ${created.id ?? created.key ?? "ZOHO_ACCOUNTS_JSON"}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
