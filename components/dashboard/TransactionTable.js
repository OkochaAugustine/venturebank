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
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        status === "completed" && "bg-emerald-50 text-emerald-700",
        status === "pending" && "bg-amber-50 text-amber-700",
        status === "failed" && "bg-red-50 text-red-700"
      )}
    >
      {status}
    </span>
  );
}

function TransactionIcon({ type }) {
  const isCredit = type === "credit";
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
        isCredit ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
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
    return <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (!transactions.length) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-ocean-950">Recent transactions</h2>
          <p className="text-sm text-slate-500">Your account activity</p>
        </div>
        <div className="p-6">
          <EmptyState
            icon={HiOutlineArrowsRightLeft}
            title="No transactions yet"
            description="When you receive deposits, make transfers, or payments, they will appear here in real time."
            actionLabel="Make a transfer"
            actionHref="/dashboard/transfer"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ocean-950">Recent transactions</h2>
          <p className="text-sm text-slate-500">Your latest account activity</p>
        </div>
        <Link href="/dashboard/transactions" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 hover:text-ocean-900">
          View all
          <HiOutlineArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-6 py-3 font-semibold text-slate-600">Transaction</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Category</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Account</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Date</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={txn.id} className={cn("border-b border-slate-50 hover:bg-ocean-50/30", i === transactions.length - 1 && "border-0")}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <TransactionIcon type={txn.type} />
                    <div>
                      <p className="font-medium text-slate-800">{txn.description}</p>
                      <p className="font-mono text-xs text-slate-400">{txn.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{txn.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{txn.account}</td>
                <td className="px-6 py-4 text-slate-600">
                  {formatDate(txn.date, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={txn.status} />
                </td>
                <td className={cn("px-6 py-4 text-right font-semibold tabular-nums", txn.type === "credit" ? "text-emerald-600" : "text-slate-800")}>
                  {txn.type === "credit" ? "+" : ""}
                  {formatCurrency(Math.abs(txn.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {transactions.map((txn) => (
          <div key={txn.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex justify-between gap-3">
              <div className="flex gap-3">
                <TransactionIcon type={txn.type} />
                <div>
                  <p className="font-medium text-slate-800">{txn.description}</p>
                  <p className="text-xs text-slate-500">{txn.account}</p>
                </div>
              </div>
              <p className={cn("font-semibold", txn.type === "credit" ? "text-emerald-600" : "text-slate-800")}>
                {formatCurrency(Math.abs(txn.amount))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
