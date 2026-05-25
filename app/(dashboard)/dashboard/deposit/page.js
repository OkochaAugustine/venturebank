"use client";

import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { DashboardPageShell, DashboardEmptyCard } from "@/components/dashboard/DashboardPageShell";

export default function DepositPage() {
  return (
    <DashboardPageShell title="Deposit" description="Add funds to your VentureBank accounts">
      <DashboardEmptyCard
        icon={HiOutlineArrowDownTray}
        title="No deposits yet"
        description="Wire transfers and admin-posted deposits will credit your account and appear in your balance. Contact support to initiate your first deposit."
        actionHref="/dashboard/support"
        actionLabel="Contact Support"
      />
    </DashboardPageShell>
  );
}
