import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminWithdrawalsPanel } from "@/components/admin/AdminWithdrawalsPanel";

export default async function AdminWithdrawalsPage() {
  const session = await getSession();
  return (
    <AdminShell user={session}>
      <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Withdrawal requests</h2>
      <AdminWithdrawalsPanel />
    </AdminShell>
  );
}
