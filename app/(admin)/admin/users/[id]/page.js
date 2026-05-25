import { AdminShell } from "@/components/admin/AdminShell";
import { AdminUserDetail } from "@/components/admin/AdminUserDetail";
import { getSession } from "@/lib/session";

export default async function AdminUserPage({ params }) {
  const session = await getSession();
  const { id } = await params;
  return (
    <AdminShell user={session}>
      <AdminUserDetail userId={id} />
    </AdminShell>
  );
}
