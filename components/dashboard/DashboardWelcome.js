"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineArrowsRightLeft,
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentText,
  HiOutlineWallet,
} from "react-icons/hi2";
import { formatCurrency } from "@/lib/utils";
import { useDashboardContext } from "@/context/DashboardContext";

const quickActions = [
  { label: "Transfer", href: "/dashboard/transfer", icon: HiOutlineArrowsRightLeft },
  { label: "Transactions", href: "/dashboard/transactions", icon: HiOutlineDocumentText },
  { label: "Accounts", href: "/dashboard/accounts", icon: HiOutlineWallet },
  { label: "Support", href: "/dashboard/support", icon: HiOutlineChatBubbleLeftRight },
];

export function DashboardWelcome() {
  const { data, loading } = useDashboardContext();
  const total = data?.totalBalance ?? 0;
  const hasActivity = data?.hasActivity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl bg-gradient-to-r from-ocean-800 via-ocean-700 to-ocean-600 p-6 text-white shadow-lg sm:p-8"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-ocean-100">Total balance</p>
          <p className="mt-1 font-serif text-3xl font-semibold sm:text-4xl">
            {loading ? "—" : formatCurrency(total)}
          </p>
          <p className="mt-2 text-sm text-ocean-200">
            {hasActivity
              ? "Across all your VentureBank accounts"
              : "Welcome! Fund your account via support or an admin deposit to get started."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
