import { createClient } from "@supabase/supabase-js";
import rawNicheConfigs from "../niche_configs.json" with { type: "json" };

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const rows = Object.entries(rawNicheConfigs).map(([niche, config]) => ({
  niche,
  config,
  updated_at: new Date().toISOString(),
}));

const { error } = await supabase.from("niche_configs").upsert(rows, {
  onConflict: "niche",
});

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} niche configs.`);
