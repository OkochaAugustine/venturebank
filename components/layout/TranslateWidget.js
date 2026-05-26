"use client";

import { useEffect, useState, useCallback } from "react";
import { HiOutlineLanguage, HiOutlineChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { TRANSLATE_LANGUAGES } from "@/lib/translate-languages";
import { applyPageLanguage, ensureEnglishDefault, getStoredLanguage } from "@/lib/google-translate";

export { TRANSLATE_LANGUAGES };

export function TranslateWidget({ compact = false, className }) {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState("en");
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const syncLang = useCallback(() => {
    setCurrent(getStoredLanguage());
  }, []);

  useEffect(() => {
    ensureEnglishDefault();
    setMounted(true);
    syncLang();
    window.addEventListener("venturebank:translate-ready", syncLang);
    return () => window.removeEventListener("venturebank:translate-ready", syncLang);
  }, [syncLang]);

  async function handleSelect(langCode) {
    setOpen(false);
    if (langCode === current || switching) return;
    setSwitching(true);
    setCurrent(langCode);
    await applyPageLanguage(langCode);
    setSwitching(false);
    syncLang();
  }

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 animate-pulse rounded-lg bg-muted",
          compact ? "w-9" : "w-28",
          className
        )}
        aria-hidden
      />
    );
  }

  const currentLabel =
    TRANSLATE_LANGUAGES.find((l) => l.code === current)?.label || "English";

  return (
    <div className={cn("notranslate relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={switching}
        className={cn(
          "flex items-center gap-1.5 rounded-lg border border-border bg-card text-foreground shadow-sm transition-colors hover:border-brand-500/50 hover:bg-muted",
          compact ? "h-9 px-2 text-xs" : "h-10 px-3 text-sm",
          switching && "opacity-70"
        )}
        aria-label="Select language"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <HiOutlineLanguage className={cn("shrink-0 text-brand-600", compact ? "h-4 w-4" : "h-5 w-5")} />
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
            className="absolute right-0 z-[70] mt-2 max-h-[min(320px,60vh)] w-[min(240px,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-xl"
          >
            <li className="border-b border-border px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Translate page
            </li>
            {TRANSLATE_LANGUAGES.map((lang) => (
              <li key={lang.code} role="option" aria-selected={current === lang.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                    current === lang.code
                      ? "bg-brand-500/10 font-semibold text-brand-700 dark:text-brand-300"
                      : "text-foreground"
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
