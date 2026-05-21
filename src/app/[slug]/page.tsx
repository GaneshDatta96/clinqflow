import { redirect } from "next/navigation";

export default async function LegacySlugPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ patientId?: string; token?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const qs = new URLSearchParams();
  if (query.patientId) qs.set("patientId", query.patientId);
  if (query.token) qs.set("token", query.token);
  const suffix = qs.toString() ? `?${qs}` : "";
  redirect(`/c/${slug}${suffix}`);
}
