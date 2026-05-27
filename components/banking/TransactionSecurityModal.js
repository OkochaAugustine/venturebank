"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineXMark,
  HiOutlineLockClosed,
} from "react-icons/hi2";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!open || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {/* BACKDROP */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* MODAL WRAPPER */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-brand-700 to-brand-800 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <HiOutlineShieldCheck className="h-6 w-6" />
              <h2 className="font-semibold">{title}</h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg p-1 hover:bg-white/10"
            >
              <HiOutlineXMark className="h-5 w-5" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="p-5">
            {step === "review" && summary && (
              <div className="mb-5 space-y-3 rounded-xl bg-muted/60 p-4 text-sm">
                {summary.map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-semibold">{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {step === "security" && (
              <div className="space-y-4">
                <Input
                  label="Banking PIN"
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />

                <Input
                  label="Security answer"
                  type="password"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                disabled={loading}
              >
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
      </div>
    </AnimatePresence>,
    document.body
  );
}

export function buildAmountSummary(rows, amount) {
  return [...rows, { label: "Total", value: formatCurrency(amount), highlight: true }];
}