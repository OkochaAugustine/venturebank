"use client";

import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import { DashboardPageShell, DashboardEmptyCard } from "@/components/dashboard/DashboardPageShell";

export default function SwapPage() {
  return (
    <DashboardPageShell title="Currency Swap" description="Exchange between supported fiat currencies">
      <DashboardEmptyCard
        icon={HiOutlineArrowsUpDown}
        title="No swap history"
        description="Fund your account first, then use currency swap when multiple currency wallets are enabled on your profile."
        actionHref="/dashboard/accounts"
        actionLabel="View Accounts"
      />
    </DashboardPageShell>
  );
}
