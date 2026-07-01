import { getSupabaseAdmin } from "@/lib/db/supabase-admin";
import {
  buildClinicDefinition,
  getAllClinics,
  getClinicBySlug,
  getClinicByNiche,
  getClinicHeadline,
  getNicheOptions,
  isSupportedNiche,
  nicheConfigSchema,
  nicheConfigs,
  type ClinicDefinition,
  type NicheConfig,
  type NicheKey,
} from "@/lib/clinics/niche-configs";

type ClinicRow = {
  id: string;
  tenant_id: string;
  name: string;
  slug: string;
  niche: string;
  location: string | null;
  country: string | null;
  website: string | null;
  description: string | null;
  approach: string | null;
  created_at: string | null;
};

function getLocalConfig(niche: string) {
  return isSupportedNiche(niche) ? nicheConfigs[niche] : null;
}

async function getConfigsForNiches(niches: string[]) {
  const configs = new Map<string, NicheConfig>();

  for (const niche of niches) {
    const local = getLocalConfig(niche);
    if (local) {
      configs.set(niche, local);
    }
  }

  const supabase = getSupabaseAdmin();
  if (!supabase || niches.length === 0) {
    return configs;
  }

  const { data, error } = await supabase
    .from("niche_configs")
    .select("niche, config")
    .in("niche", niches);

  if (!error && data) {
    for (const row of data) {
      try {
        configs.set(row.niche, nicheConfigSchema.parse(row.config));
      } catch {
        const local = getLocalConfig(row.niche);
        if (local) configs.set(row.niche, local);
      }
    }
  }

  return configs;
}

async function getConfigForNiche(niche: string): Promise<NicheConfig | null> {
  const configs = await getConfigsForNiches([niche]);
  return configs.get(niche) ?? null;
}

function buildFromRow(row: ClinicRow, config: NicheConfig): ClinicDefinition {
  return buildClinicDefinition({
    id: row.id,
    tenantId: row.tenant_id,
    slug: row.slug,
    niche: row.niche,
    clinicName: row.name,
    headline: getClinicHeadline({
      niche: row.niche,
      description: row.description,
      approach: row.approach,
    }),
    location: row.location ?? undefined,
    country: row.country ?? undefined,
    website: row.website ?? undefined,
    description: row.description ?? undefined,
    approach: row.approach ?? undefined,
    createdAt: row.created_at ?? undefined,
    config,
  });
}

export async function getClinicForSlug(
  slug: string,
  tenantId?: string,
): Promise<ClinicDefinition | null> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return getClinicBySlug(slug);
  }

  let query = supabase
    .from("clinics")
    .select(
      "id, tenant_id, name, slug, niche, location, country, website, description, approach, created_at",
    )
    .eq("slug", slug)
    .is("deleted_at", null);

  if (tenantId) {
    query = query.eq("tenant_id", tenantId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    return tenantId ? null : getClinicBySlug(slug);
  }

  const config = await getConfigForNiche(data.niche);

  if (!config) {
    return getClinicBySlug(slug) ?? getClinicByNiche(data.niche);
  }

  return buildFromRow(data, config);
}

export async function listClinicsForTenant(tenantId: string) {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return getAllClinics();
  }

  const { data, error } = await supabase
    .from("clinics")
    .select(
      "id, tenant_id, name, slug, niche, location, country, website, description, approach, created_at",
    )
    .eq("tenant_id", tenantId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  const configs = await getConfigsForNiches(Array.from(new Set(data.map((c) => c.niche))));

  return data
    .map((row) => {
      const config = configs.get(row.niche);
      return config ? buildFromRow(row, config) : null;
    })
    .filter((c): c is ClinicDefinition => c !== null);
}

export { getNicheOptions };
