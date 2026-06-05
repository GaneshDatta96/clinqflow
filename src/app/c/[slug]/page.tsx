import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PatientIntakeExperience } from "@/components/intake/patient-intake-experience";
import { getClinicForSlug } from "@/lib/clinics/store";
import { buildPageMetadata, NOINDEX_ROBOTS } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata({
    title: "Patient intake",
    description: "Secure patient intake form.",
    path: `/c/${slug}`,
    robots: NOINDEX_ROBOTS,
  });
}

export default async function PublicClinicIntakePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ patientId?: string; token?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const clinic = await getClinicForSlug(slug);

  if (!clinic) {
    notFound();
  }

  const patientId = typeof query.patientId === "string" ? query.patientId : null;
  const intakeToken = typeof query.token === "string" ? query.token : null;

  return (
    <PatientIntakeExperience
      clinic={clinic}
      initialPatientId={patientId}
      intakeToken={intakeToken}
      mode="public"
    />
  );
}
