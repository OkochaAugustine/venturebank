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
import { formatCurrency, maskAccountNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BTC_PLACEHOLDER = "0.000000";

export function BankingCard({
  holderName,
  fiatBalance = 0,
  accountNumber,
  accountLabel = "Primary Checking",
  className,
}) {
  const [hidden, setHidden] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const displayFiat = hidden ? "••••••" : formatCurrency(fiatBalance);
  const displayBtc = hidden ? "••••••" : `${BTC_PLACEHOLDER} BTC`;
  const displayAccount = !accountNumber
    ? "—"
    : showAccount && !hidden
      ? accountNumber.replace(/(\d{4})(?=\d)/g, "$1 ")
      : maskAccountNumber(accountNumber);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("w-full max-w-[400px] sm:mx-auto lg:max-w-[380px]", className)}
    >
      <div
        className={cn(
          "relative aspect-[1.72/1] w-full overflow-hidden rounded-2xl p-4 shadow-xl sm:aspect-[1.586/1] sm:p-6",
          "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950",
          "ring-1 ring-white/10"
        )}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex h-full flex-col justify-between text-white">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/90">
                VentureBank
              </p>
              <p className="mt-1 text-xs text-blue-100/80">{accountLabel}</p>
            </div>
            <button
              type="button"
              onClick={() => setHidden((h) => !h)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label={hidden ? "Show balances" : "Hide balances"}
            >
              {hidden ? (
                <HiOutlineEye className="h-5 w-5" />
              ) : (
                <HiOutlineEyeSlash className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-blue-200/70">Fiat balance</p>
              <p className="font-mono text-2xl font-bold tracking-tight sm:text-3xl">{displayFiat}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-blue-200/70">Bitcoin</p>
              <p className="font-mono text-sm font-semibold text-amber-200/90 sm:text-base">{displayBtc}</p>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-blue-200/70">Cardholder</p>
              <p className="truncate text-sm font-medium uppercase tracking-wide">{holderName}</p>
            </div>
            <div className="text-right">
              <p className="mb-0.5 text-[10px] text-blue-200/70">Valid thru</p>
              <p className="font-mono text-sm">••/••</p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-wider text-blue-200/70">Account number</p>
              <p className="truncate font-mono text-sm tracking-widest">{displayAccount}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAccount((s) => !s)}
              disabled={hidden || !accountNumber}
              className="shrink-0 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-medium backdrop-blur hover:bg-white/20 disabled:opacity-40"
            >
              {showAccount && !hidden ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 sm:gap-3">
        <Link
          href="/dashboard/transfer"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <HiOutlineArrowsRightLeft className="h-4 w-4" />
          Send Money
        </Link>
        <Link
          href="/dashboard/deposit"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Money
        </Link>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Account Active
        </span>
        {fiatBalance === 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            Zero balance — fund via deposit or support
          </span>
        )}
      </div>
    </motion.div>
  );
}
