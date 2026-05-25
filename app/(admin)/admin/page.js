import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsers } from "@/components/admin/AdminUsers";

export default async function AdminPage() {
  const session = await getSession();

  return (
    <AdminShell user={session}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-ocean-950">Dashboard overview</h2>
          <p className="text-sm text-slate-500">Manage members, deposits, and support</p>
        </div>
        <AdminUsers />
      </div>
    </AdminShell>
  );
}
