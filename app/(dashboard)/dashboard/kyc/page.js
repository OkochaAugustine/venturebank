import { getSessionUser } from "@/lib/session";
import { KycForm } from "@/components/dashboard/KycForm";

export const metadata = {
  title: "Identity Verification | VentureBank",
};

export default async function KycPage() {
  const user = await getSessionUser();
  return (
    <div className="w-full max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">KYC Verification</h1>
        <p className="mt-1 text-sm text-slate-500">Verify your identity to unlock full banking features</p>
      </div>
      <KycForm initialStatus={user?.kycStatus || "none"} />
    </div>
  );
}
