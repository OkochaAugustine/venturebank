"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineWallet,
} from "react-icons/hi2";
import { useState } from "react";
import { cn, formatCurrency, maskAccountNumber } from "@/lib/utils";
import { useDashboardContext } from "@/context/DashboardContext";
import { EmptyState } from "./EmptyState";

export function BalanceCards() {
  const { data, loading } = useDashboardContext();
  const [hidden, setHidden] = useState(false);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
      </div>
    );
  }

  const accounts = data?.accounts || [];

  if (!accounts.length) {
    return (
      <EmptyState
        icon={HiOutlineWallet}
        title="No accounts yet"
        description="Your checking and savings accounts are ready. Balances update when deposits or transfers are posted to your account."
        actionLabel="Contact support"
        actionHref="/dashboard/support"
      />
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ocean-950">Your accounts</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setHidden(!hidden)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ocean-700"
          >
            {hidden ? <HiOutlineEye className="h-4 w-4" /> : <HiOutlineEyeSlash className="h-4 w-4" />}
            {hidden ? "Show" : "Hide"} balances
          </button>
          <Link href="/dashboard/accounts" className="text-sm font-semibold text-ocean-700 hover:underline">
            View all
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account, i) => (
          <motion.article
            key={account.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{account.name}</p>
                <p className="text-xs capitalize text-slate-400">{account.accountType}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  account.balance > 0 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                )}
              >
                {account.balance > 0 ? "Active" : "Zero balance"}
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold text-ocean-950">
              {hidden ? "••••••" : formatCurrency(account.balance)}
            </p>
            <p className="mt-2 font-mono text-xs text-slate-400">
              {maskAccountNumber(account.accountNumber)}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
