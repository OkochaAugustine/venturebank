"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineWallet,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineChartBar,
  HiOutlinePlus,
  HiOutlineArrowsRightLeft,
  HiOutlineDocumentText,
  HiOutlineArrowDownCircle,
  HiOutlineCreditCard,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClock,
} from "react-icons/hi2";
import { useDashboardContext } from "@/context/DashboardContext";
import { BankingCard } from "@/components/dashboard/BankingCard";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    red: "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    purple: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/90"
    >
      <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", colors[color])}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white sm:text-xl">{value}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </motion.div>
  );
}

function Panel({ title, action, children, className }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-800/90",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function OceanDashboard({ userName }) {
  const { data, loading } = useDashboardContext();
  const stats = data?.stats;
  const accounts = data?.accounts || [];
  const transactions = data?.transactions || [];
  const primary = accounts[0];
  const total = data?.totalBalance ?? 0;
  const firstName = userName?.split(" ")[0] || "Member";
  const fullName = userName || "Member";

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
          ))}
        </div>
        <div className="mx-auto h-52 max-w-[420px] animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">Welcome back, {firstName}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={HiOutlineWallet}
          label="Account Limit"
          value={formatCurrency(stats?.accountLimit ?? 500000)}
          sub="Available"
          color="blue"
        />
        <StatCard
          icon={HiOutlineArrowDownTray}
          label="Monthly Deposits"
          value={formatCurrency(stats?.monthlyDeposits ?? 0)}
          sub="This month"
          color="green"
        />
        <StatCard
          icon={HiOutlineArrowUpTray}
          label="Monthly Expenses"
          value={formatCurrency(stats?.monthlyExpenses ?? 0)}
          sub="This month"
          color="red"
        />
        <StatCard
          icon={HiOutlineChartBar}
          label="Total Volume"
          value={formatCurrency(stats?.totalVolume ?? 0)}
          sub="All time activity"
          color="purple"
        />
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(280px,400px)_1fr] lg:items-start">
        <div className="w-full shrink-0 lg:sticky lg:top-24">
          <BankingCard
            holderName={fullName.toUpperCase()}
            fiatBalance={total}
            accountNumber={primary?.accountNumber}
            accountLabel={primary?.name || "Primary Checking"}
          />
        </div>

        <div className="grid min-w-0 flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Panel
            title="Recent Transactions"
            action={
              <Link href="/dashboard/transactions" className="text-xs font-semibold text-blue-600 hover:underline">
                View all
              </Link>
            }
          >
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <HiOutlineClock className="h-6 w-6 text-slate-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">No recent transactions</p>
                <p className="mt-1 max-w-xs text-xs text-slate-500">
                  Deposits and transfers will appear here once your account has activity.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {transactions.slice(0, 6).map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3 first:pt-0">
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                        {t.description}
                      </p>
                      <p className="text-xs text-slate-400">{t.account}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 text-sm font-semibold tabular-nums",
                        t.type === "credit" ? "text-emerald-600" : "text-slate-800 dark:text-slate-200"
                      )}
                    >
                      {t.type === "credit" ? "+" : ""}
                      {formatCurrency(Math.abs(t.amount))}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Account Statistics">
            <ul className="space-y-4">
              {[
                {
                  label: "Transaction limit",
                  value: formatCurrency(stats?.accountLimit ?? 500000),
                  icon: HiOutlineWallet,
                  color: "text-blue-600",
                },
                {
                  label: "Pending",
                  value: formatCurrency(stats?.pendingAmount ?? 0),
                  icon: HiOutlineClock,
                  color: "text-amber-600",
                },
                {
                  label: "Total volume",
                  value: formatCurrency(stats?.totalVolume ?? 0),
                  icon: HiOutlineChartBar,
                  color: "text-emerald-600",
                },
              ].map((row) => (
                <li key={row.label} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <row.icon className={cn("h-5 w-5 shrink-0", row.color)} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{row.label}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Quick Actions" className="lg:col-span-1">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Transfer", href: "/dashboard/transfer", icon: HiOutlineArrowsRightLeft },
              { label: "Pay Bills", href: "/dashboard/transactions", icon: HiOutlineDocumentText },
              { label: "Receive", href: "/dashboard/accounts", icon: HiOutlineArrowDownCircle },
              { label: "Details", href: "/dashboard/accounts", icon: HiOutlineWallet },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-blue-800"
              >
                <a.icon className="h-6 w-6 text-blue-600" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{a.label}</span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Quick Transfer" className="lg:col-span-1">
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-8 dark:border-slate-600">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md"
              aria-label="Add beneficiary"
            >
              <HiOutlinePlus className="h-5 w-5" />
            </button>
            <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">No saved beneficiaries</p>
            <p className="text-xs text-slate-500">Add one to transfer faster</p>
            <Link href="/dashboard/transfer" className="mt-3 text-sm font-semibold text-blue-600 hover:underline">
              Add New
            </Link>
          </div>
        </Panel>

        <Panel
          title="Need assistance?"
          className="border-blue-100 bg-gradient-to-br from-blue-50/90 to-white dark:border-blue-900/50 dark:from-slate-800 dark:to-slate-800/90 lg:col-span-1"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Encrypted live chat · Typical response under 5 minutes
          </p>
          <Link
            href="/dashboard/support"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <HiOutlineChatBubbleLeftRight className="h-5 w-5" />
            Start Live Chat
          </Link>
        </Panel>
      </div>

      <Panel
        title="Active Cards"
        action={
          <Link href="/dashboard/cards" className="text-xs font-semibold text-blue-600 hover:underline">
            View all
          </Link>
        }
      >
        <div className="flex flex-col items-center py-6 sm:flex-row sm:justify-center sm:gap-8">
          <div className="relative h-20 w-32 shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HiOutlineCreditCard className="h-10 w-10 text-white/90" />
            </div>
          </div>
          <div className="mt-4 text-center sm:mt-0 sm:text-left">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No active cards</p>
            <p className="mt-1 text-xs text-slate-500">Apply for a debit or credit card</p>
            <Link
              href="/dashboard/cards"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <HiOutlinePlus className="h-4 w-4" /> Apply for Card
            </Link>
          </div>
        </div>
      </Panel>
    </div>
  );
}
