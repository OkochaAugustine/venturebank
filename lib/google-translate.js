import { TRANSLATE_LANGUAGES } from "@/lib/translate-languages";

export const GOOGLE_INCLUDED_LANGUAGES = TRANSLATE_LANGUAGES.map((l) => l.code)
  .filter((code) => code !== "en")
  .join(",");

export function getStoredLanguage() {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return "en";
  const parts = decodeURIComponent(match[1]).split("/");
  const lang = parts[parts.length - 1];
  return lang && lang !== "en" ? lang : "en";
}

function isLocalhost(hostname) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".localhost");
}

export function setTranslateCookie(langCode) {
  const value = langCode === "en" ? "/en/en" : `/en/${langCode}`;
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  document.cookie = `googtrans=${value};path=/;expires=${expires};SameSite=Lax`;

  if (hostname && !isLocalhost(hostname)) {
    document.cookie = `googtrans=${value};path=/;domain=${hostname};expires=${expires};SameSite=Lax`;
    const parts = hostname.split(".");
    if (parts.length > 1) {
      document.cookie = `googtrans=${value};path=/;domain=.${parts.slice(-2).join(".")};expires=${expires};SameSite=Lax`;
    }
  }
}

export function triggerTranslateCombo(langCode) {
  const select = document.querySelector("select.goog-te-combo");
  if (!select) return false;

  const target = langCode === "en" ? "" : langCode;
  if (select.value === target) return true;

  select.value = target;
  select.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

export function applyPageLanguage(langCode) {
  setTranslateCookie(langCode);

  if (triggerTranslateCombo(langCode)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const onReady = () => {
      if (triggerTranslateCombo(langCode)) {
        window.removeEventListener("venturebank:translate-ready", onReady);
        resolve(true);
      }
    };
    window.addEventListener("venturebank:translate-ready", onReady);
    setTimeout(() => {
      window.removeEventListener("venturebank:translate-ready", onReady);
      window.location.reload();
      resolve(false);
    }, 2500);
  });
}
