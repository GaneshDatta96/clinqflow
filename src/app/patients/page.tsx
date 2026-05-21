import { redirect } from "next/navigation";

export default function LegacyPatientsPage() {
  redirect("/app/patients");
}
