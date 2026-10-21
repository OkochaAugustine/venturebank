"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlinePlus,
  HiOutlineArrowsRightLeft,
} from "react-icons/hi2";
import { maskAccountNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function BankingCard({
  holderName,
  accountNumber,
  accountLabel = "Primary Checking",
  balance,
  className,
}) {
  const [hidden, setHidden] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const numericBalance =
    balance !== undefined &&
    balance !== null &&
    balance !== "" &&
    Number.isFinite(Number(balance))
      ? Number(balance)
      : null;

  const displayBalance =
    numericBalance === null
      ? "Unavailable"
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numericBalance);

  const displayAccount = !accountNumber
    ? "—"
    : showAccount && !hidden
      ? String(accountNumber).replace(/(\d{4})(?=\d)/g, "$1 ")
      : maskAccountNumber(String(accountNumber));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mx-auto w-full min-w-0 max-w-[400px] lg:max-w-[380px]",
        className
      )}
    >
      {/* Bank card */}
      <div
        className={cn(
          "relative isolate w-full overflow-hidden rounded-2xl",
          "min-h-[220px] aspect-[1.586/1] p-4 sm:p-5",
          "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950",
          "shadow-xl ring-1 ring-white/10"
        )}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full min-h-[220px] min-w-0 flex-col justify-between gap-3 text-white">
          {/* Bank name and visibility control */}
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/90">
                VentureBank
              </p>

              <p className="mt-1 truncate text-xs text-blue-100/80">
                {accountLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHidden((previous) => !previous)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label={hidden ? "Show balance" : "Hide balance"}
              title={hidden ? "Show balance" : "Hide balance"}
            >
              {hidden ? (
                <HiOutlineEye className="h-5 w-5" />
              ) : (
                <HiOutlineEyeSlash className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Actual account balance */}
          <div className="min-w-0 py-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-blue-200/80">
              Available Balance
            </p>

            <p
              className="mt-1 break-words text-2xl font-semibold leading-tight tracking-tight sm:text-3xl"
              aria-live="polite"
            >
              {hidden ? "••••••••" : displayBalance}
            </p>
          </div>

          {/* Cardholder information */}
          <div className="flex min-w-0 items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-[0.15em] text-blue-200/70">
                Cardholder
              </p>

              <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide sm:text-sm">
                {holderName || "Account Holder"}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[9px] text-blue-200/70">
                Valid thru
              </p>

              <p className="mt-1 font-mono text-xs">••/••</p>
            </div>
          </div>

          {/* Account number */}
          <div className="flex min-w-0 items-center justify-between gap-2 border-t border-white/10 pt-3">
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[9px] uppercase tracking-[0.15em] text-blue-200/70">
                Account Number
              </p>

              <p className="mt-1 truncate font-mono text-xs tracking-wider sm:text-sm">
                {hidden ? "••••••••" : displayAccount}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAccount((previous) => !previous)}
              disabled={hidden || !accountNumber}
              className="shrink-0 rounded-lg bg-white/10 px-3 py-2 text-[11px] font-medium backdrop-blur transition hover:bg-white/20 disabled:opacity-40"
            >
              {showAccount && !hidden ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="mt-4 flex min-w-0 flex-wrap justify-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/transfer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <HiOutlineArrowsRightLeft className="h-4 w-4 shrink-0" />
          Send Money
        </Link>

        <Link
          href="/dashboard/deposit"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          <HiOutlinePlus className="h-4 w-4 shrink-0" />
          Add Money
        </Link>
      </div>

      {/* Account status */}
      <div className="mt-3 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Account Active
        </span>
      </div>
    </motion.div>
  );
}
