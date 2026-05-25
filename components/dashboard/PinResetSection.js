"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function PinResetSection() {
  const [password, setPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/pin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, currentPin, newPin, confirmPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not update PIN");
        return;
      }
      setMessage(data.message || "PIN updated successfully");
      setPassword("");
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <Input
        label="Account password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        label="Current PIN"
        type="password"
        inputMode="numeric"
        maxLength={6}
        value={currentPin}
        onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="New PIN"
          type="password"
          inputMode="numeric"
          maxLength={6}
          required
          value={newPin}
          onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
        <Input
          label="Confirm new PIN"
          type="password"
          inputMode="numeric"
          maxLength={6}
          required
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Updating..." : "Update PIN"}
      </Button>
    </form>
  );
}
