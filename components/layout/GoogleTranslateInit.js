"use client";

import Script from "next/script";

export function GoogleTranslateInit() {
  return (
    <>
      <Script
        id="google-translate-loader"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div
        id="google_translate_element"
        className="notranslate pointer-events-none fixed -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      />
    </>
  );
}
