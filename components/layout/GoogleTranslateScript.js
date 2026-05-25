"use client";

import Script from "next/script";

/** Loads Google Translate script once (used with cookie-based language switching). */
export function GoogleTranslateScript() {
  return (
    <Script
      id="google-translate-loader"
      src="https://translate.google.com/translate_a/element.js"
      strategy="afterInteractive"
    />
  );
}
