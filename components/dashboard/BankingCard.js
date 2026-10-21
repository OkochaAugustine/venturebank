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
  fiatBalance,
  className,
}) {
  const [hidden, setHidden] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const resolvedBalance = balance ?? fiatBalance;

  const parseBalanceValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? value : null;
    }

    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    const negative = trimmed.startsWith("(") && trimmed.endsWith(")");
    const normalized = (negative ? trimmed.slice(1, -1) : trimmed)
      .replace(/^[A-Za-z]{3}\s*/i, "")
      .replace(/[$,\s]/g, "");

    if (!normalized) {
      return null;
    }

    const numericValue = Number(normalized);
    return Number.isFinite(numericValue)
      ? numericValue * (negative ? -1 : 1)
      : null;
  };

  const numericBalance = parseBalanceValue(resolvedBalance);

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
      initial={{ opacity: 0, y: 8 }}
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
          "aspect-[1.586/1] min-h-[200px] p-3 sm:p-4",
          "bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950",
          "shadow-xl ring-1 ring-white/10"
        )}
      >
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="pointer-events-none absolute -bottom-10 -left-8 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' opacity=\'.15\'%3E%3Cpath d=\'M0 30h60M30 0v60\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        {/* Card content */}
        <div className="relative z-10 flex h-full min-h-[200px] min-w-0 flex-col justify-between gap-2 text-white">
          {/* Bank name and visibility control */}
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-blue-100">
                VentureBank
              </p>

              <p className="mt-0.5 truncate text-[11px] font-semibold text-blue-100/80">
                {accountLabel}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHidden((previous) => !previous)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              aria-label={hidden ? "Show balance" : "Hide balance"}
              title={hidden ? "Show balance" : "Hide balance"}
            >
              {hidden ? (
                <HiOutlineEye className="h-4 w-4" />
              ) : (
                <HiOutlineEyeSlash className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Account balance */}
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-200">
              Available Balance
            </p>

            <p
              className="mt-1 max-w-full break-words text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
              aria-live="polite"
            >
              {hidden ? "••••••••" : displayBalance}
            </p>
          </div>

          {/* Cardholder information */}
          <div className="flex min-w-0 items-end justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-200/80">
                Cardholder
              </p>

              <p className="mt-0.5 truncate text-xs font-bold uppercase tracking-wide sm:text-sm">
                {holderName || "Account Holder"}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-[9px] font-semibold text-blue-200/80">
                Valid thru
              </p>

              <p className="mt-0.5 font-mono text-xs font-bold">••/••</p>
            </div>
          </div>

          {/* Account number */}
          <div className="flex min-w-0 items-center justify-between gap-2 border-t border-white/15 pt-2">
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-blue-200/80">
                Account Number
              </p>

              <p className="mt-0.5 truncate font-mono text-xs font-bold tracking-wide sm:text-sm">
                {hidden ? "••••••••" : displayAccount}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAccount((previous) => !previous)}
              disabled={hidden || !accountNumber}
              className="shrink-0 rounded-lg bg-white/10 px-2.5 py-1.5 text-[11px] font-bold transition hover:bg-white/20 disabled:opacity-40"
            >
              {showAccount && !hidden ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {/* Card actions */}
      <div className="mt-3 flex min-w-0 flex-wrap justify-center gap-2">
        <Link
          href="/dashboard/transfer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          <HiOutlineArrowsRightLeft className="h-4 w-4 shrink-0" />
          Send Money
        </Link>

        <Link
          href="/dashboard/deposit"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          <HiOutlinePlus className="h-4 w-4 shrink-0" />
          Add Money
        </Link>
      </div>

      {/* Account status */}
      <div className="mt-2 flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Account Active
        </span>
      </div>
    </motion.div>
  );
}
