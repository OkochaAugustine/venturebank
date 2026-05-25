"use client";

import { motion } from "framer-motion";
import { HiOutlineWallet } from "react-icons/hi2";
import { BalanceCards } from "@/components/dashboard/BalanceCards";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { useDashboardContext } from "@/context/DashboardContext";
import { formatCurrency } from "@/lib/utils";

export default function AccountsPage() {
  const { data } = useDashboardContext();
  const total = data?.totalBalance ?? 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
            <HiOutlineWallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ocean-950">Accounts</h1>
            <p className="text-sm text-slate-500">
              Combined balance {formatCurrency(total)} across all member accounts
            </p>
          </div>
        </div>
      </motion.div>
      <BalanceCards />
      <StatsRow />
    </div>
  );
}
