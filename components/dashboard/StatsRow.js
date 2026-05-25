"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { useDashboardContext } from "@/context/DashboardContext";

export function StatsRow() {
  const { data, loading } = useDashboardContext();
  const stats = data?.stats;

  const items = stats
    ? [
        { label: "Total balance", value: formatCurrency(stats.totalBalance), change: stats.totalBalance > 0 ? "Current" : "No funds" },
        { label: "Accounts", value: String(stats.accountCount), change: "Linked" },
        { label: "Transactions", value: String(stats.transactionCount), change: stats.transactionCount ? "Recorded" : "None yet" },
        { label: "This month", value: formatCurrency(stats.monthlySpend), change: stats.pendingCount ? `${stats.pendingCount} pending` : "Spending" },
      ]
    : [];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{stat.label}</p>
          <p className="mt-2 text-xl font-bold text-ocean-950 sm:text-2xl">{stat.value}</p>
          <p className={cn("mt-1 text-xs font-medium text-slate-500")}>{stat.change}</p>
        </motion.div>
      ))}
    </div>
  );
}
