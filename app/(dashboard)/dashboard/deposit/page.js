"use client";

import { DepositForm } from "@/components/dashboard/DepositForm";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default function DepositPage() {
  return (
    <DashboardPageShell
      title="Deposit"
      description="Submit a funding request — credited after VentureBank confirms receipt"
    >
      <DepositForm />
    </DashboardPageShell>
  );
}
