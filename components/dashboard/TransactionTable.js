"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  HiOutlineArrowDownLeft,
  HiOutlineArrowUpRight,
  HiOutlineArrowRight,
  HiOutlineArrowsRightLeft,
} from "react-icons/hi2";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useDashboardContext } from "@/context/DashboardContext";
import { EmptyState } from "./EmptyState";

function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        status === "completed" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        status === "pending" && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        status === "failed" && "bg-red-500/15 text-red-700 dark:text-red-400",
        status === "reversed" && "bg-slate-500/15 text-slate-600 dark:text-slate-400",
        status === "cancelled" && "bg-slate-500/15 text-slate-500"
      )}
    >
      {status}
    </span>
  );
}

function TransactionIcon({ type, isReversal }) {
  const isCredit = type === "credit";
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        isReversal && "bg-slate-500/15 text-slate-600",
        !isReversal && isCredit && "bg-emerald-500/15 text-emerald-600",
        !isReversal && !isCredit && "bg-red-500/15 text-red-600"
      )}
    >
      {isCredit ? (
        <HiOutlineArrowDownLeft className="h-5 w-5" />
      ) : (
        <HiOutlineArrowUpRight className="h-5 w-5" />
      )}
    </div>
  );
}

export function TransactionTable({ limit }) {
  const { data, loading } = useDashboardContext();
  const transactions = limit
    ? (data?.transactions || []).slice(0, limit)
    : data?.transactions || [];

  if (loading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-muted" />;
  }

  if (!transactions.length) {
    return (
      <section className="surface-card overflow-hidden">
        <div className="border-b border-border p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
          <p className="text-sm text-muted-foreground">Your account activity</p>
        </div>
        <div className="p-6">
          <EmptyState
            icon={HiOutlineArrowsRightLeft}
            title="No transactions yet"
            description="Deposits, transfers, and withdrawals will appear here in real time with email and in-app alerts."
            actionLabel="Make a transfer"
            actionHref="/dashboard/transfer"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recent transactions</h2>
          <p className="text-sm text-muted-foreground">Live ledger · synced with alerts</p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          View all
          <HiOutlineArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-5 py-3 font-semibold text-muted-foreground">Transaction</th>
              <th className="px-5 py-3 font-semibold text-muted-foreground">Category</th>
              <th className="px-5 py-3 font-semibold text-muted-foreground">Account</th>
              <th className="px-5 py-3 font-semibold text-muted-foreground">Date</th>
              <th className="px-5 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="px-5 py-3 text-right font-semibold text-muted-foreground">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <motion.tr
                key={txn.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border/60 transition-colors hover:bg-muted/30"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <TransactionIcon type={txn.type} isReversal={txn.isReversal} />
                    <div>
                      <p className="font-medium text-foreground">{txn.description}</p>
                      <p className="font-mono text-xs text-muted-foreground">{txn.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize text-muted-foreground">
                    {txn.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-muted-foreground">{txn.account}</td>
                <td className="px-5 py-4 text-muted-foreground">
                  {formatDate(txn.date, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={txn.status} />
                </td>
                <td
                  className={cn(
                    "px-5 py-4 text-right font-bold tabular-nums",
                    txn.type === "credit" ? "text-emerald-600" : "text-foreground"
                  )}
                >
                  {txn.type === "credit" ? "+" : ""}
                  {formatCurrency(Math.abs(txn.amount))}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 p-3 md:hidden">
        {transactions.map((txn) => (
          <div key={txn.id} className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex justify-between gap-3">
              <div className="flex gap-3">
                <TransactionIcon type={txn.type} isReversal={txn.isReversal} />
                <div>
                  <p className="font-medium text-foreground">{txn.description}</p>
                  <p className="text-xs text-muted-foreground">{txn.account}</p>
                </div>
              </div>
              <p className={cn("font-bold tabular-nums", txn.type === "credit" ? "text-emerald-600" : "text-foreground")}>
                {formatCurrency(Math.abs(txn.amount))}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <StatusBadge status={txn.status} />
              <p className="text-[10px] text-muted-foreground">{formatDate(txn.date, { month: "short", day: "numeric" })}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
