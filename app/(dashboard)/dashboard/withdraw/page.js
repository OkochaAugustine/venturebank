"use client";

import { WithdrawForm } from "@/components/dashboard/WithdrawForm";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default function WithdrawPage() {
  return (
    <DashboardPageShell
      title="Withdraw"
      description="Request a secure withdrawal — VentureBank security code approval required"
    >
      <WithdrawForm />
    </DashboardPageShell>
  );
}
