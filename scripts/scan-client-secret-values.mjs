const base = "https://cliniqflow.app";
const pages = ["/", "/login", "/signup", "/app/dashboard", "/app/billing"];

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(String(res.status));
  return res.text();
}

async function main() {
  const visited = new Set();
  const queue = new Set();

  for (const page of pages) {
    try {
      const html = await fetchText(`${base}${page}`);
      for (const m of html.matchAll(/\/_next\/static\/[^"']+\.js/g)) {
        queue.add(base + m[0]);
      }
    } catch (e) {
      console.log("skip", page, e.message);
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

    for (const m of js.matchAll(/\/_next\/static\/[^"']+\.js/g)) {
      queue.add(base + m[0]);
    }
  }

  console.log("TOTAL_CHUNKS", visited.size);

  const bad = [];
  for (const url of visited) {
    const js = await fetchText(url);

    for (const hit of js.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g)) {
      try {
        const payload = JSON.parse(
          Buffer.from(hit[0].split(".")[1], "base64url").toString(),
        );
        if (payload.role === "service_role") {
          bad.push({ type: "SERVICE_ROLE_JWT", url });
        }
      } catch {
        /* ignore */
      }
    }

    if (/sk-or-v1-[A-Za-z0-9]{8,}/.test(js)) bad.push({ type: "OPENROUTER_KEY", url });
    if (/sk_live_[A-Za-z0-9]{8,}/.test(js)) bad.push({ type: "STRIPE_LIVE_KEY", url });
    if (/sk_test_[A-Za-z0-9]{8,}/.test(js)) bad.push({ type: "STRIPE_TEST_KEY", url });
  }

  if (bad.length === 0) {
    console.log("PASS: No actual secret values in", visited.size, "chunks");
  } else {
    console.log("FAIL:");
    console.log(bad);
  }
}

main();
