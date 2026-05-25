"use client";

import { useTheme } from "next-themes";
import { HiOutlineMoon, HiOutlineSun, HiOutlineShieldCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { PinResetSection } from "@/components/dashboard/PinResetSection";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <h1 className="text-2xl font-semibold text-ocean-950 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Appearance, PIN, and security preferences</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <h2 className="font-semibold text-ocean-950 dark:text-white">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500">Light or dark mode for online banking</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            variant={theme === "light" ? "primary" : "outline"}
            onClick={() => setTheme("light")}
          >
            <HiOutlineSun className="mr-2 h-4 w-4" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "primary" : "outline"}
            onClick={() => setTheme("dark")}
          >
            <HiOutlineMoon className="mr-2 h-4 w-4" />
            Dark
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <div className="flex items-center gap-3">
          <HiOutlineShieldCheck className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold text-ocean-950 dark:text-white">PIN recovery & reset</h2>
            <p className="mt-1 text-sm text-slate-500">
              Change your banking PIN using your account password and current PIN.
            </p>
          </div>
        </div>
        <PinResetSection />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
        <h2 className="font-semibold text-ocean-950 dark:text-white">Session security</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sessions use HTTP-only cookies and JWT. PIN verification is required on every login.
        </p>
      </section>
    </div>
  );
}
