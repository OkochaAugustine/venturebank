"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export function AdminUserDetail({ userId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [action, setAction] = useState("credit");
  const [messageTitle, setMessageTitle] = useState("Message from VentureBank");
  const [messageBody, setMessageBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  function load() {
    setLoading(true);
    fetch(`/api/admin/users/${userId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.accounts?.[0]) setAccountId(d.accounts[0].id);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [userId]);

  async function postBalance(e) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        accountId,
        amount: parseFloat(amount),
        description,
        action,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Failed");
      return;
    }
    setMsg(`Success — balance ${formatCurrency(json.account.balance)}`);
    setAmount("");
    load();
  }

  async function sendUserMessage(e) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        action: "message",
        title: messageTitle,
        message: messageBody,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Failed to send message");
      return;
    }
    setMsg("Message sent to user notifications.");
    setMessageBody("");
  }

  async function approveDeposit(txnId) {
    const res = await fetch(`/api/admin/transactions/${txnId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "approve_deposit" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Approve failed");
      return;
    }
    setMsg(`Deposit approved — balance ${formatCurrency(json.newBalance)}`);
    load();
  }

  async function reverseTxn(txnId) {
    if (!confirm("Reverse this transaction? Balance will be adjusted.")) return;
    const res = await fetch(`/api/admin/transactions/${txnId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "reverse", reason: "Admin reversal" }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Reverse failed");
      return;
    }
    setMsg(`Reversed — ref ${json.reversalReference}`);
    load();
  }

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />;
  if (!data?.user) return <p>User not found</p>;

  const { user, accounts, transactions } = data;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-slate-500">{user.email}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
        {accounts.map((a) => (
          <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-200 uppercase truncate">{a.name}</p>
            <p className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(a.balance)}</p>
            <p className="font-mono text-xs text-slate-400 truncate">{a.accountNumber}</p>
          </div>
        ))}
      </div>

      <form onSubmit={postBalance} className="max-w-lg space-y-3 sm:space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Wallet control</h3>
        <Select label="Account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </Select>
        <Select label="Action" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="credit">Credit (deposit)</option>
          <option value="debit">Debit (withdraw)</option>
        </Select>
        <Input label="Amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        {msg && <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">{msg}</p>}
        <Button type="submit" variant="primary" className="w-full sm:w-auto">Apply & notify member</Button>
      </form>

      <form onSubmit={sendUserMessage} className="max-w-lg space-y-3 sm:space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">Send notification to this user</h3>
        <Input
          label="Subject"
          value={messageTitle}
          onChange={(e) => setMessageTitle(e.target.value)}
          placeholder="Message from VentureBank"
        />
        <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200">
          Message
        </label>
        <textarea
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          placeholder="Write a note that will appear in the user's notification bell"
          required
        />
        <Button type="submit" variant="outline" className="w-full sm:w-auto">Send notification</Button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
        <h3 className="border-b border-slate-100 px-4 py-3 text-base sm:text-lg font-semibold dark:border-slate-700">Transactions</h3>
        {transactions.length === 0 ? (
          <p className="p-4 sm:p-6 text-sm text-slate-500">No transactions.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {transactions.slice(0, 25).map((t) => (
              <li key={t.id} className="flex flex-col gap-2 px-3 py-3 sm:px-4 sm:py-3 sm:gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{t.description}</p>
                  <p className="font-mono text-xs text-slate-400 truncate">{t.reference}</p>
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                      t.status === "completed" && "bg-emerald-100 text-emerald-800",
                      t.status === "pending" && "bg-amber-100 text-amber-800",
                      t.status === "reversed" && "bg-slate-100 text-slate-600"
                    )}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className="font-semibold tabular-nums text-sm sm:text-base whitespace-nowrap">{formatCurrency(Math.abs(t.amount))}</span>
                  <div className="flex gap-1 sm:gap-2 ml-auto sm:ml-0">
                    {t.status === "pending" && t.rawType === "deposit" && (
                      <Button type="button" variant="primary" size="sm" className="text-xs" onClick={() => approveDeposit(t.id)}>
                        Approve
                      </Button>
                    )}
                    {t.status === "completed" && (
                      <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => reverseTxn(t.id)}>
                        Reverse
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button variant="outline" onClick={() => router.push("/admin/users")}>
        Back to users
      </Button>
    </div>
  );
}
