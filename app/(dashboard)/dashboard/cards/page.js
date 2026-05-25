"use client";

import { HiOutlineCreditCard } from "react-icons/hi2";
import { DashboardPageShell, DashboardEmptyCard } from "@/components/dashboard/DashboardPageShell";

export default function CardsPage() {
  return (
    <DashboardPageShell title="Cards" description="Manage debit and credit cards linked to your accounts">
      <DashboardEmptyCard
        icon={HiOutlineCreditCard}
        title="No active cards"
        description="Apply for a VentureBank debit or credit card. Once approved, your card will appear here with limits and controls."
        actionHref="/dashboard/support"
        actionLabel="Apply for Card"
      />
    </DashboardPageShell>
  );
}
