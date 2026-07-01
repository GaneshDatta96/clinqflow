import { redirect } from "next/navigation";
import { PlatformMfaVerify } from "@/components/auth/platform-mfa-verify";
import { requireUser } from "@/lib/tenancy/context";
import { isEmailConfiguredAsPlatformStaff } from "@/lib/tenancy/platform-admin";

export const dynamic = "force-dynamic";

export default async function PlatformMfaVerifyPage() {
  const { user } = await requireUser();

  if (!isEmailConfiguredAsPlatformStaff(user.email)) {
    redirect("/app/dashboard");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Verify multi-factor authentication
      </h1>
      <div className="mt-6">
        <PlatformMfaVerify />
      </div>
    </div>
  );
}
