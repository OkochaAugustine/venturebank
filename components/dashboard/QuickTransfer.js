"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane, HiOutlineShieldCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useDashboardContext } from "@/context/DashboardContext";
import {
  TransactionSecurityModal,
  buildAmountSummary,
} from "@/components/banking/TransactionSecurityModal";
import { formatCurrency } from "@/lib/utils";

export function QuickTransfer() {
  const { data, refresh } = useDashboardContext();
  const accounts = data?.accounts || [];
  const [fromAccountId, setFromAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [note, setNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedId = fromAccountId || accounts[0]?.id || "";
  const selectedAccount = accounts.find((a) => a.id === selectedId);

  function openConfirm(e) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!recipientName.trim()) {
      setError("Recipient name is required");
      return;
    }
    if (selectedAccount && selectedAccount.balance < amt) {
      setError("Insufficient funds");
      return;
    }
    setModalOpen(true);
  }

  async function executeTransfer({ pin, securityAnswer }) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/banking/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          accountId: selectedId,
          amount: parseFloat(amount),
          recipientName,
          recipientAccount,
          description: note,
          pin,
          securityAnswer,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Transfer failed");
      setSuccess(true);
      setAmount("");
      setNote("");
      setRecipientName("");
      setRecipientAccount("");
      refresh();
      setTimeout(() => setSuccess(false), 4000);
    } finally {
      setSubmitting(false);
    }
  }

  if (!accounts.length) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">
          Transfers require an active account with available balance. Make a deposit or contact support.
        </p>
      </div>
    );
  }

  const summary = buildAmountSummary(
    [
      { label: "From", value: selectedAccount?.name || "Account" },
      { label: "To", value: recipientName || "—" },
      { label: "Account", value: recipientAccount || "—" },
    ],
    parseFloat(amount) || 0
  );

  return (
    <>
      <motion.section
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        className="surface-card p-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-700 dark:text-brand-300">
            <HiOutlinePaperAirplane className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Quick transfer</h2>
            <p className="text-xs text-muted-foreground">PIN + security verification required</p>
          </div>
        </div>

        <form onSubmit={openConfirm} className="space-y-4">
          <Select label="From account" value={selectedId} onChange={(e) => setFromAccountId(e.target.value)}>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — {formatCurrency(acc.balance)}
              </option>
            ))}
          </Select>
          <Input label="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
          <Input label="Recipient account" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} placeholder="Account or routing number" />
          <Input label="Amount (USD)" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Input label="Memo" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {success && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              Transfer completed. Check your alerts for confirmation.
            </p>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50/80 px-3 py-2.5 dark:border-emerald-900 dark:bg-emerald-950/30">
            <HiOutlineShieldCheck className="h-5 w-5 text-emerald-600" />
            <p className="text-xs text-emerald-800 dark:text-emerald-300">Encrypted · PIN verified before execution</p>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={!amount || submitting}>
            Review & confirm transfer
          </Button>
        </form>
      </motion.section>

      <TransactionSecurityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeTransfer}
        title="Confirm transfer"
        summary={summary}
        confirmLabel="Send transfer"
        loading={submitting}
      />
    </>
  );
}
