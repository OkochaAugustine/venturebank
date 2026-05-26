"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDashboardContext } from "@/context/DashboardContext";

export function ProfileSettingsForm({ initialPhone = "", initialFirstName = "", initialLastName = "" }) {
  const { data } = useDashboardContext();
  const profile = data?.user;

  const [phone, setPhone] = useState(initialPhone);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  useEffect(() => {
    if (!profile) return;
    if (profile.phone) setPhone(profile.phone);
    if (profile.firstName) setFirstName(profile.firstName);
    if (profile.lastName) setLastName(profile.lastName);
  }, [profile]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, firstName, lastName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      setMsg("Profile updated. Check your alerts and email for confirmation.");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
      </div>
      <Input label="Mobile number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      {msg && <p className="text-sm text-emerald-600">{msg}</p>}
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
