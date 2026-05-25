"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HiOutlineIdentification } from "react-icons/hi2";

const ID_TYPES = [
  "National ID",
  "Passport",
  "Driver License",
  "Residence Permit",
];

export function KycForm({ initialStatus = "none" }) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    idType: ID_TYPES[0],
    idNumber: "",
    address: "",
    country: "",
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Submission failed");
        return;
      }
      setStatus(data.kycStatus || "pending");
      setMessage(data.message);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const statusStyles = {
    none: { text: "Not started", color: "bg-slate-100 text-slate-700" },
    pending: { text: "Under review", color: "bg-amber-100 text-amber-800" },
    verified: { text: "Verified", color: "bg-emerald-100 text-emerald-800" },
    rejected: { text: "Needs resubmission", color: "bg-red-100 text-red-800" },
  };
  const statusLabel = statusStyles[status] || statusStyles.none;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950">
          <HiOutlineIdentification className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-slate-900 dark:text-white">Identity verification (KYC)</h2>
          <p className="text-sm text-slate-500">Required for higher limits and international transfers</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusLabel.color}`}>
          {statusLabel.text}
        </span>
      </div>

      {status === "verified" ? (
        <p className="text-sm text-emerald-600">Your identity has been verified. No further action needed.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full legal name"
              required
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className="sm:col-span-2"
            />
            <Input
              label="Date of birth"
              type="date"
              required
              value={form.dateOfBirth}
              onChange={(e) => update("dateOfBirth", e.target.value)}
            />
            <Select
              label="ID type"
              value={form.idType}
              onChange={(e) => update("idType", e.target.value)}
            >
              {ID_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Input
              label="ID number"
              required
              value={form.idNumber}
              onChange={(e) => update("idNumber", e.target.value)}
            />
            <Input
              label="Country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
            <Input
              label="Residential address"
              required
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="sm:col-span-2"
            />
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {message && <p className="mt-4 text-sm text-emerald-600">{message}</p>}
          <Button type="submit" variant="primary" className="mt-6 w-full sm:w-auto" disabled={loading || status === "pending"}>
            {loading ? "Submitting..." : status === "pending" ? "Submitted — awaiting review" : "Submit for verification"}
          </Button>
        </form>
      )}
    </div>
  );
}
