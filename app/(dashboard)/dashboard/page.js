import { getSession } from "@/lib/session";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export const metadata = {
  title: "Dashboard",
  description: "VentureBank online banking",
};

export default async function DashboardPage() {
  const session = await getSession();
  const userName = session
    ? `${session.firstName} ${session.lastName || ""}`.trim()
    : "Member";

  return <DashboardOverview userName={userName} />;
}
