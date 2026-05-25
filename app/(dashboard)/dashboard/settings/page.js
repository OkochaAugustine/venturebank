"use client";

import { useTheme } from "next-themes";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ocean-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage appearance and security preferences</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-ocean-950">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500">Choose light or dark mode for online banking</p>
        <div className="mt-4 flex gap-3">
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

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-ocean-950">Security</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your session is protected with HTTP-only cookies and JWT authentication. Contact support to update your security question.
        </p>
      </section>
    </div>
  );
}
