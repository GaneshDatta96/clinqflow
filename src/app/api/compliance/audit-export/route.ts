import { createApiHandler } from "@/lib/api/handler";
import { PRIVATE_NO_STORE } from "@/lib/http/cache-control";
import { requirePermission } from "@/lib/tenancy/context";

export const GET = createApiHandler({
  route: "/api/compliance/audit-export",
  step: "audit_export",
  rateLimit: "read_heavy",
  handler: async () => {
    const { supabase, context } = await requirePermission("tenant:manage");

    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, action, resource_type, resource_id, metadata, created_at, actor_id")
      .eq("tenant_id", context.tenantId)
      .order("created_at", { ascending: false })
      .limit(5000);

    if (error) {
      return Response.json(
        { error: "Export failed" },
        { status: 500, headers: { "Cache-Control": PRIVATE_NO_STORE } },
      );
    }

    return new Response(JSON.stringify({ exported_at: new Date().toISOString(), logs: data ?? [] }, null, 2), {
      headers: {
        "Cache-Control": PRIVATE_NO_STORE,
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="audit-export-${context.tenantId}.json"`,
      },
    });
  },
});
