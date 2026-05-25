"use client";

import { motion } from "framer-motion";
import { HiOutlineArrowsRightLeft } from "react-icons/hi2";
import { QuickTransfer } from "@/components/dashboard/QuickTransfer";
import { BalanceCards } from "@/components/dashboard/BalanceCards";

export default function TransferPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
            <HiOutlineArrowsRightLeft className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-ocean-950">Transfer money</h1>
            <p className="text-sm text-slate-500">
              Send funds securely between your accounts or to other members.
            </p>
          </div>
        </div>
      </motion.div>
      <QuickTransfer />
      <BalanceCards />
    </div>
  );
}
