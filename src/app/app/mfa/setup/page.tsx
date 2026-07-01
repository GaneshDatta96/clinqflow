import { redirect } from "next/navigation";
import { PlatformMfaSetup } from "@/components/auth/platform-mfa-setup";
import { requireUser } from "@/lib/tenancy/context";
import { isEmailConfiguredAsPlatformStaff } from "@/lib/tenancy/platform-admin";

export const dynamic = "force-dynamic";

export default async function PlatformMfaSetupPage() {
  const { user } = await requireUser();

  if (!isEmailConfiguredAsPlatformStaff(user.email)) {
    redirect("/app/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Set up multi-factor authentication
      </h1>
      <div className="mt-6">
        <PlatformMfaSetup />
      </div>
    </div>
  );
}
