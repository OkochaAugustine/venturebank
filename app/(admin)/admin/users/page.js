import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUsers } from "@/components/admin/AdminUsers";
import { getSession } from "@/lib/session";

export default async function AdminUsersPage() {
  const session = await getSession();
  return (
    <AdminShell user={session}>
      <h2 className="mb-6 text-2xl font-semibold text-ocean-950">Members</h2>
      <AdminUsers />
    </AdminShell>
  );
}
