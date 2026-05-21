import { createApiHandler, jsonOk } from "@/lib/api/handler";
import { requirePlatformAdmin } from "@/lib/tenancy/platform-admin";

export const GET = createApiHandler({
  route: "/api/admin/tenants",
  step: "admin_list_tenants",
  handler: async () => {
    const { supabase } = await requirePlatformAdmin();

    const { data, error } = await supabase
      .from("tenants")
      .select(
        "id, name, slug, plan_key, subscription_status, trial_ends_at, created_at",
      )
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      throw error;
    }

    return jsonOk({ tenants: data ?? [] });
  },
});
