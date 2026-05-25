"use client";

import { HiOutlineBanknotes } from "react-icons/hi2";
import { DashboardPageShell, DashboardEmptyCard } from "@/components/dashboard/DashboardPageShell";

export default function LoansPage() {
  return (
    <DashboardPageShell title="Loans" description="Personal and business lending">
      <DashboardEmptyCard
        icon={HiOutlineBanknotes}
        title="No active loans"
        description="You have no loan applications or active balances. Speak with support to explore rates and pre-qualification."
        actionHref="/dashboard/support"
        actionLabel="Speak with Support"
      />
    </DashboardPageShell>
  );
}
