import { z } from "zod";
import { createApiHandler, jsonCreated } from "@/lib/api/handler";
import { createDemoClinic } from "@/lib/clinics/store";
import { requirePermission } from "@/lib/tenancy/context";

const schema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  niche: z.string().trim().min(1),
  location: z.string().trim().optional(),
  country: z.string().trim().optional(),
  website: z.string().trim().optional(),
  description: z.string().trim().optional(),
  approach: z.string().trim().optional(),
});

export const POST = createApiHandler({
  route: "/api/clinics/create-demo",
  step: "create_demo_clinic",
  schema,
  handler: async ({ body }) => {
    const { context } = await requirePermission("clinic:create");

    const clinic = await createDemoClinic({
      tenantId: context.tenantId,
      name: body.name,
      slug: body.slug,
      niche: body.niche,
      location: body.location,
      country: body.country,
      website: body.website,
      description: body.description,
      approach: body.approach,
      createdBy: context.userId,
    });

    return jsonCreated({ clinic });
  },
});
