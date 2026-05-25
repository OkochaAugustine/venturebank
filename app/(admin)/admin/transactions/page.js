import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { TransactionsContent } from "./TransactionsContent";

export default async function AdminTransactionsPage() {
  const session = await getSession();
  return (
    <AdminShell user={session}>
      <h2 className="mb-6 text-2xl font-semibold text-ocean-950">All transactions</h2>
      <TransactionsContent />
    </AdminShell>
  );
}
