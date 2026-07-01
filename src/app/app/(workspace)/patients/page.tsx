"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, CheckCircle, Users } from "lucide-react";
import { fetchApi, getErrorMessage, readApiError } from "@/lib/api/client";
import { SkeletonFormCard, SkeletonPageHeader } from "@/components/ui/skeleton";
import {
  AnimatedTooltipHint,
  PlaceholdersVanishInput,
  StatefulButton,
} from "@/components/ui/aceternity";
import { EmptyState } from "@/components/ui/empty-state";

const patientSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  clinic_id: z.string().uuid(),
});

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type Clinic = { id: string; slug: string; clinicName: string };

export default function AppPatientsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    setClinicsLoading(true);
    fetchApi<{ clinics: Clinic[] }>("/api/clinics")
      .then((data) => {
        const list = data.clinics ?? [];
        setClinics(
          list
            .filter((c) => c.id)
            .map((c) => ({
              id: c.id!,
              slug: c.slug,
              clinicName: c.clinicName,
            })),
        );
        if (list[0]?.id) {
          form.setValue("clinic_id", list[0].id!);
        }
      })
      .catch((err) => setError(getErrorMessage(err, "Unable to load clinics.")))
      .finally(() => setClinicsLoading(false));
  }, [form]);

  async function onSubmit(values: z.infer<typeof patientSchema>) {
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch("/api/patients/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw await readApiError(res);
      const patient = (await res.json()) as Patient;
      setPatients((p) => [patient, ...p]);

      const linkRes = await fetch("/api/intake/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient.id,
          clinic_id: values.clinic_id,
        }),
      });
      if (linkRes.ok) {
        const linkData = await linkRes.json();
        await navigator.clipboard.writeText(linkData.url);
        setCopiedId(patient.id);
      }
      form.reset({ ...values, first_name: "", last_name: "", email: "" });
    } catch (e) {
      setError(getErrorMessage(e, "Error creating patient"));
      throw e;
    } finally {
      setIsPending(false);
    }
  }

  const selectedClinic = clinics.find((c) => c.id === form.watch("clinic_id"));

  if (clinicsLoading) {
    return (
      <div className="space-y-8">
        <SkeletonPageHeader />
        <SkeletonFormCard fields={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="display-font text-3xl tracking-tight">Patients</h1>
        <p className="mt-2 font-serif text-[color:var(--muted)]">
          Create patients and generate secure intake links.
        </p>
      </header>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-4 rounded-2xl border border-[color:var(--line)] bg-white/80 p-6"
      >
        {clinics.length > 0 && (
          <label className="block">
            <span className="text-sm font-semibold">Clinic</span>
            <select
              className="mt-1 w-full rounded-xl border px-4 py-3"
              {...form.register("clinic_id")}
            >
              {clinics.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.clinicName}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            placeholder="First name"
            className="rounded-xl border px-4 py-3"
            {...form.register("first_name")}
          />
          <input
            placeholder="Last name"
            className="rounded-xl border px-4 py-3"
            {...form.register("last_name")}
          />
        </div>
        <PlaceholdersVanishInput
          type="email"
          name="email"
          required
          placeholders={[
            "patient@email.com",
            "maria.garcia@example.com",
            "intake-ready@clinicmail.com",
          ]}
          value={form.watch("email") ?? ""}
          onChange={(value) =>
            form.setValue("email", value, { shouldValidate: true, shouldDirty: true })
          }
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <StatefulButton
          type="button"
          disabled={isPending}
          loadingLabel="Creating patient…"
          successLabel="Link copied"
          className="w-full sm:w-auto"
          onClick={async () => {
            const valid = await form.trigger();
            if (!valid) {
              throw new Error("Please complete all fields.");
            }
            await onSubmit(form.getValues());
          }}
        >
          Create patient & copy intake link
        </StatefulButton>
      </form>

      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients yet"
          description="Create your first patient to generate a secure intake link."
        />
      ) : (
      <ul className="space-y-3">
        {patients.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-[color:var(--line)] bg-white/80 px-4 py-3"
          >
            <span>
              {p.first_name} {p.last_name} · {p.email}
            </span>
            {copiedId === p.id && (
              <span className="flex items-center gap-1 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" /> Link copied
              </span>
            )}
          </li>
        ))}
      </ul>
      )}
      {selectedClinic && (
        <p className="caption flex items-center gap-1.5 text-[color:var(--muted)]">
          Intake URLs use path /c/{selectedClinic.slug} with a single secure link per patient.
          <AnimatedTooltipHint label="Each patient gets one signed link with their ID and access token embedded.">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[color:var(--line)] text-[10px] font-bold text-[color:var(--muted)]">
              ?
            </span>
          </AnimatedTooltipHint>
        </p>
      )}
    </div>
  );
}
