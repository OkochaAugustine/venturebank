"use client";

import { HiOutlineDocumentText } from "react-icons/hi2";
import { DashboardPageShell, DashboardEmptyCard } from "@/components/dashboard/DashboardPageShell";

export default function TaxRefundPage() {
  return (
    <DashboardPageShell title="Tax Refund" description="Track tax refund deposits to your account">
      <DashboardEmptyCard
        icon={HiOutlineDocumentText}
        title="No tax refund activity"
        description="When a tax refund is deposited to your VentureBank account, it will appear here with status and reference numbers."
        actionHref="/dashboard/transactions"
        actionLabel="View Transactions"
      />
    </DashboardPageShell>
  );
}
