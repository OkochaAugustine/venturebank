"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlinePaperAirplane, HiOutlineShieldCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useDashboardContext } from "@/context/DashboardContext";

export function QuickTransfer() {
  const { data, refresh } = useDashboardContext();
  const accounts = data?.accounts || [];
  const [fromAccountId, setFromAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selectedId = fromAccountId || accounts[0]?.id || "";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fromAccountId: selectedId,
          amount: parseFloat(amount),
          recipientName,
          recipientAccount,
          description: note,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Transfer failed");
      setSuccess(true);
      setAmount("");
      setNote("");
      refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!accounts.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Transfers require an active account with available balance. Contact support to fund your account.
        </p>
      </div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
          <HiOutlinePaperAirplane className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ocean-950">Quick transfer</h2>
          <p className="text-xs text-slate-500">Between accounts or external recipients</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="From account" value={selectedId} onChange={(e) => setFromAccountId(e.target.value)}>
          {accounts.map((acc) => (
            <option key={acc.id} value={acc.id}>
              {acc.name} — ${acc.balance.toFixed(2)}
            </option>
          ))}
        </Select>
        <Input label="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
        <Input label="Recipient account" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} placeholder="Account or routing number" />
        <Input label="Amount (USD)" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input label="Memo" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
          <HiOutlineShieldCheck className="h-5 w-5 text-emerald-600" />
          <p className="text-xs text-emerald-800">256-bit encrypted transfer</p>
        </div>
        <Button type="submit" variant="primary" className="w-full" disabled={submitting || !amount}>
          {submitting ? "Processing..." : success ? "Transfer sent ✓" : "Send transfer"}
        </Button>
      </form>
    </motion.section>
  );
}
