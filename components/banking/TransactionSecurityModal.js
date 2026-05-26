"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineShieldCheck, HiOutlineXMark, HiOutlineLockClosed } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

export function TransactionSecurityModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm transaction",
  summary,
  confirmLabel = "Confirm & send",
  loading = false,
}) {
  const [step, setStep] = useState("review");
  const [pin, setPin] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [error, setError] = useState("");

  function handleClose() {
    if (loading) return;
    setStep("review");
    setPin("");
    setSecurityAnswer("");
    setError("");
    onClose();
  }

  async function handleConfirm() {
    setError("");
    if (step === "review") {
      setStep("security");
      return;
    }
    if (!pin || pin.length < 4) {
      setError("Enter your 4–6 digit banking PIN");
      return;
    }
    if (!securityAnswer.trim()) {
      setError("Enter your security answer");
      return;
    }
    try {
      await onConfirm({ pin, securityAnswer });
      handleClose();
    } catch (e) {
      setError(e.message || "Verification failed");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-label="Close"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[90] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <HiOutlineShieldCheck className="h-6 w-6" />
                <h2 className="font-semibold">{title}</h2>
              </div>
              <button type="button" onClick={handleClose} className="rounded-lg p-1 hover:bg-white/10">
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              {step === "review" && summary && (
                <div className="mb-5 space-y-3 rounded-xl bg-muted/60 p-4 text-sm">
                  {summary.map((row) => (
                    <div key={row.label} className="flex justify-between gap-4">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-semibold text-foreground">{row.value}</span>
                    </div>
                  ))}
                  {summary.find((r) => r.highlight) && (
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-medium">Amount</span>
                      <span className="text-lg font-bold text-brand-700 dark:text-brand-300">
                        {summary.find((r) => r.highlight)?.value}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {step === "security" && (
                <p className="mb-4 text-sm text-muted-foreground">
                  Enter your banking PIN and security answer to authorize this transaction.
                </p>
              )}

              {step === "security" && (
                <div className="space-y-4">
                  <Input
                    label="Banking PIN"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    autoComplete="off"
                  />
                  <Input
                    label="Security answer"
                    type="password"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Your registration security answer"
                  />
                </div>
              )}

              {error && (
                <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="flex-1"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  <HiOutlineLockClosed className="mr-2 h-4 w-4" />
                  {loading
                    ? "Processing..."
                    : step === "review"
                      ? "Continue"
                      : confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function buildAmountSummary(rows, amount) {
  return [
    ...rows,
    { label: "Total", value: formatCurrency(amount), highlight: true },
  ];
}
