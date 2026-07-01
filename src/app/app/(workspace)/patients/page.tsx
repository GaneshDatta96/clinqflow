"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Copy, CheckCircle, LoaderCircle } from "lucide-react";
import { fetchApi, getErrorMessage, readApiError } from "@/lib/api/client";

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
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof patientSchema>>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
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
      .catch((err) => setError(getErrorMessage(err, "Unable to load clinics.")));
  }, [form]);

  const onSubmit = (values: z.infer<typeof patientSchema>) => {
    startTransition(async () => {
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
      }
    });
  };

  const selectedClinic = clinics.find((c) => c.id === form.watch("clinic_id"));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Patients</h1>
        <p className="mt-2 text-[color:var(--muted)]">
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
        <input
          placeholder="Email"
          type="email"
          className="w-full rounded-xl border px-4 py-3"
          {...form.register("email")}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-3 text-sm font-semibold text-white"
        >
          {isPending && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Create patient & copy intake link
        </button>
      </form>

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
      {selectedClinic && (
        <p className="text-sm text-[color:var(--muted)]">
          Intake URLs use path /c/{selectedClinic.slug} with a single secure link per patient.
        </p>
      )}
    </div>
  );
}
