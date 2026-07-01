#!/usr/bin/env node
/**
 * Scans live Cliniqflow JS bundles for leaked secret patterns.
 * Usage: node scripts/scan-client-secrets.mjs [baseUrl]
 */

const base = (process.argv[2] ?? "https://cliniqflow.app").replace(/\/$/, "");

const SECRET_PATTERNS = [
  "sk_live",
  "sk_test",
  "service_role",
  "OPENROUTER_API_KEY",
  "OPENROUTER",
  "RAZORPAY_KEY_SECRET",
  "KEY_SECRET",
  "SUPABASE_SERVICE_ROLE",
  "PAYPAL_CLIENT_SECRET",
  "CRON_SECRET",
  "INTAKE_TOKEN_SECRET",
  "UPSTASH_REDIS_REST_TOKEN",
  "RESEND_API_KEY",
  "SENDGRID_API_KEY",
  "ZOHO_ACCOUNTS_JSON",
];

const EXPECTED_PUBLIC_PATTERNS = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_RAZORPAY_KEY_ID",
  "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
  "anon",
  "rzp_test",
  "rzp_live",
];

const PAGES = ["/", "/login", "/signup", "/app/dashboard", "/app/billing"];

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function extractScriptUrls(html, origin) {
  const urls = new Set();
  const re = /(?:src|href)="([^"]+\.js[^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1];
    if (!raw.includes("/_next/static/")) continue;
    urls.add(raw.startsWith("http") ? raw : origin + raw);
  }
  return urls;
}

function extractChunkRefs(js, origin) {
  const urls = new Set();
  const re = /\/_next\/static\/[^"'\\]+\.js/g;
  let m;
  while ((m = re.exec(js)) !== null) {
    urls.add(origin + m[0]);
  }
  return urls;
}

async function main() {
  const queue = new Set();
  const visited = new Set();
  const findings = [];

  for (const page of PAGES) {
    try {
      const html = await fetchText(`${base}${page}`);
      for (const u of extractScriptUrls(html, base)) queue.add(u);
    } catch (err) {
      console.warn(`WARN page ${page}: ${err.message}`);
    }
  }

  while (queue.size > 0) {
    const url = queue.values().next().value;
    queue.delete(url);
    if (visited.has(url)) continue;
    visited.add(url);

    let js;
    try {
      js = await fetchText(url);
    } catch {
      continue;
    }

    for (const pattern of SECRET_PATTERNS) {
      if (js.includes(pattern)) {
        findings.push({ pattern, url });
      }
    }

    for (const next of extractChunkRefs(js, base)) {
      if (!visited.has(next)) queue.add(next);
    }
  }

  console.log(`Base URL: ${base}`);
  console.log(`JS bundles scanned: ${visited.size}`);
  console.log("");

  if (findings.length === 0) {
    console.log("PASS: No secret patterns found in client JS bundles.");
  } else {
    console.log("FAIL: Potential secret exposure:");
    for (const f of findings) {
      console.log(`  - ${f.pattern} in ${f.url}`);
    }
  }

  // Spot-check for JWT-shaped keys (eyJ...) — report count only, not values
  let jwtLikeCount = 0;
  for (const url of visited) {
    try {
      const js = await fetchText(url);
      const matches = js.match(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g);
      if (matches) {
        jwtLikeCount += matches.length;
        for (const token of matches) {
          const payload = token.split(".")[1] ?? "";
          let decoded = "";
          try {
            decoded = Buffer.from(payload, "base64url").toString("utf8");
          } catch {
            decoded = "";
          }
          const role = decoded.includes("service_role")
            ? "SERVICE_ROLE (BAD)"
            : decoded.includes("anon")
              ? "anon (expected if Supabase public key)"
              : "unknown JWT";
          console.log(`JWT-like token in ${url}: role=${role}`);
        }
      }
    } catch {
      /* ignore */
    }
  }

  if (jwtLikeCount === 0) {
    console.log("JWT scan: no eyJ... tokens found in bundles.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
