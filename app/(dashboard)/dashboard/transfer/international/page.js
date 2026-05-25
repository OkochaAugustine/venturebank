"use client";

import { HiOutlineGlobeAlt } from "react-icons/hi2";
import Link from "next/link";
import { QuickTransfer } from "@/components/dashboard/QuickTransfer";
import { DashboardPageShell } from "@/components/dashboard/DashboardPageShell";

export default function InternationalTransferPage() {
  return (
    <DashboardPageShell
      title="International Transfer"
      description="Send funds securely across borders with SWIFT-compatible routing"
    >
      <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        International transfers require sufficient balance and verified account status.{" "}
        <Link href="/dashboard/support" className="font-semibold underline">
          Contact support
        </Link>{" "}
        for high-value wires.
      </div>
      <QuickTransfer />
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 p-8 dark:border-slate-600">
        <HiOutlineGlobeAlt className="h-10 w-10 text-blue-600" />
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">No international beneficiaries saved</p>
          <p className="text-sm text-slate-500">Save a recipient after your first successful transfer</p>
        </div>
      </div>
    </DashboardPageShell>
  );
}
