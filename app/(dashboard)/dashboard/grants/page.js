"use client";

import { HiOutlineGift } from "react-icons/hi2";
import { DashboardPageShell, DashboardEmptyCard } from "@/components/dashboard/DashboardPageShell";

export default function GrantsPage() {
  return (
    <DashboardPageShell title="Grants" description="Government and institutional grant disbursements">
      <DashboardEmptyCard
        icon={HiOutlineGift}
        title="No grant disbursements"
        description="Grant payments credited to your account will be listed here with program details and deposit dates."
        actionHref="/dashboard/support"
        actionLabel="Get Help"
      />
    </DashboardPageShell>
  );
}
