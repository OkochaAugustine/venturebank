import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardProvider } from "@/context/DashboardContext";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <DashboardProvider>
      <DashboardShell user={session}>{children}</DashboardShell>
    </DashboardProvider>
  );
}
