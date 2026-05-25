"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineLockClosed,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { AuthFormLayout } from "./AuthFormLayout";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Personal", icon: HiOutlineUser },
  { id: 2, title: "Credentials", icon: HiOutlineLockClosed },
  { id: 3, title: "Security", icon: HiOutlineShieldCheck },
  { id: 4, title: "Verify", icon: HiOutlineCheckCircle },
];

const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was your first school?",
];

export function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: "",
    verificationCode: "",
    agreeTerms: false,
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function validateStep() {
    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) return "Name is required";
      if (!form.email.trim()) return "Email is required";
    }
    if (step === 2) {
      if (form.password.length < 8) return "Password must be at least 8 characters";
      if (form.password !== form.confirmPassword) return "Passwords do not match";
    }
    if (step === 3) {
      if (!form.securityAnswer.trim()) return "Security answer is required";
      if (!form.agreeTerms) return "You must accept the terms";
    }
    if (step === 4) {
      if (form.verificationCode.length !== 6) return "Enter the 6-digit code";
    }
    return null;
  }

  async function sendCode() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
        }),
      });
      const text = await res.text();
      let json = {};
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          res.status >= 500
            ? "Server error. Check MongoDB and SMTP in .env.local, then restart the dev server."
            : "Invalid server response"
        );
      }
      if (!res.ok) throw new Error(json.error || "Failed to send verification code");
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function completeRegistration() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    if (step === 3) {
      await sendCode();
      return;
    }
    if (step === 4) {
      await completeRegistration();
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <AuthFormLayout
      title="Open your account"
      subtitle="Secure 4-step enrollment — bank-grade identity verification"
    >
      <div className="mb-8 flex justify-between gap-2">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const active = step === s.id;
          const done = step > s.id;
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  done && "border-emerald-500 bg-emerald-500 text-white",
                  active && !done && "border-ocean-600 bg-ocean-600 text-white",
                  !active && !done && "border-slate-200 bg-white text-slate-400"
                )}
              >
                {done ? <HiOutlineCheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={cn("text-[10px] font-semibold uppercase", active ? "text-ocean-800" : "text-slate-400")}>
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="First name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} required />
                <Input label="Last name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} required />
              </div>
              <Input label="Email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </>
          )}
          {step === 2 && (
            <>
              <Input label="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
              <Input label="Confirm password" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
              <p className="text-xs text-slate-500">Minimum 8 characters with letters and numbers recommended.</p>
            </>
          )}
          {step === 3 && (
            <>
              <Select label="Security question" value={form.securityQuestion} onChange={(e) => update("securityQuestion", e.target.value)}>
                {SECURITY_QUESTIONS.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </Select>
              <Input label="Security answer" value={form.securityAnswer} onChange={(e) => update("securityAnswer", e.target.value)} required />
              <label className="flex items-start gap-3 text-sm text-slate-600">
                <input type="checkbox" checked={form.agreeTerms} onChange={(e) => update("agreeTerms", e.target.checked)} className="mt-1" />
                I agree to the Terms of Service, Privacy Policy, and E-Sign consent.
              </label>
            </>
          )}
          {step === 4 && (
            <>
              <p className="text-sm text-slate-600">
                We sent a 6-digit code to <strong>{form.email}</strong>. Enter it below to activate your account.
              </p>
              {devCode && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Dev mode code: <strong>{devCode}</strong>
                </p>
              )}
              <Input
                label="Verification code"
                value={form.verificationCode}
                onChange={(e) => update("verificationCode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                required
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        {step > 1 && step < 4 && (
          <Button type="button" variant="outline" className="flex-1" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        )}
        <Button type="button" variant="primary" className="flex-1" onClick={handleNext} disabled={loading}>
          {loading ? "Please wait..." : step === 3 ? "Send verification code" : step === 4 ? "Complete registration" : "Continue"}
        </Button>
      </div>
    </AuthFormLayout>
  );
}
