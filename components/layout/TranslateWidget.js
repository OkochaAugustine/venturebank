"use client";

import { useEffect, useState } from "react";
import { HiOutlineLanguage, HiOutlineChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { TRANSLATE_LANGUAGES } from "@/lib/translate-languages";

export { TRANSLATE_LANGUAGES };

function getCurrentLang() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return match?.[1] || "en";
}

function applyLanguage(langCode) {
  const value = langCode === "en" ? "/en/en" : `/en/${langCode}`;
  const hostname = window.location.hostname;

  document.cookie = `googtrans=${value};path=/`;
  if (hostname) {
    document.cookie = `googtrans=${value};path=/;domain=${hostname}`;
    const parts = hostname.split(".");
    if (parts.length > 1) {
      document.cookie = `googtrans=${value};path=/;domain=.${parts.slice(-2).join(".")}`;
    }
  }

  window.location.reload();
}

export function TranslateWidget({ compact = false, className }) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState("en");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrent(getCurrentLang());
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700",
          compact ? "w-9" : "w-28",
          className
        )}
      />
    );
  }

  const currentLabel =
    TRANSLATE_LANGUAGES.find((l) => l.code === current)?.label || "English";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-slate-700",
          compact ? "h-9 px-2 text-xs" : "h-10 px-3 text-sm"
        )}
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <HiOutlineLanguage className={cn("shrink-0 text-blue-600", compact ? "h-4 w-4" : "h-5 w-5")} />
        {!compact && (
          <>
            <span className="max-w-[100px] truncate font-medium">{currentLabel}</span>
            <HiOutlineChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </>
        )}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60]"
            aria-label="Close language menu"
            onClick={() => setOpen(false)}
          />
          <ul
            role="listbox"
            className="absolute right-0 z-[70] mt-2 max-h-[min(320px,60vh)] w-[min(240px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-600 dark:bg-slate-800"
          >
            <li className="border-b border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-700">
              Translate page
            </li>
            {TRANSLATE_LANGUAGES.map((lang) => (
              <li key={lang.code} role="option" aria-selected={current === lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    if (lang.code !== current) applyLanguage(lang.code);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-blue-50 dark:hover:bg-slate-700",
                    current === lang.code
                      ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      : "text-slate-700 dark:text-slate-200"
                  )}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
