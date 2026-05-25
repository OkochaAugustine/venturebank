import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { USER_ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.role !== USER_ROLES.ADMIN) {
    redirect("/dashboard");
  }

  return (
    <div className="surface-page min-h-screen bg-slate-100 dark:bg-slate-950">
      {children}
    </div>
  );
}
