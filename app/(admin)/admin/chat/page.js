import { getSession } from "@/lib/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminChat } from "@/components/admin/AdminChat";

export default async function AdminChatPage() {
  const session = await getSession();
  return (
    <AdminShell user={session}>
      <h2 className="mb-6 text-2xl font-semibold text-ocean-950">Support inbox</h2>
      <AdminChat />
    </AdminShell>
  );
}
