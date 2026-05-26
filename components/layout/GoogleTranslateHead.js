import { GOOGLE_INCLUDED_LANGUAGES } from "@/lib/google-translate";

const INIT_SNIPPET = `
window.googleTranslateElementInit = function () {
  if (window.__venturebankTranslateInit) return;
  window.__venturebankTranslateInit = true;
  var el = document.getElementById("google_translate_element");
  if (!el || !window.google || !window.google.translate) return;
  new window.google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "${GOOGLE_INCLUDED_LANGUAGES}",
      autoDisplay: false,
      multilanguagePage: true,
    },
    "google_translate_element"
  );
  function syncFromCookie() {
    var lang = "en";
    try {
      if (!document.cookie.match(/(?:^|;\\s*)googtrans=/)) {
        document.cookie = "googtrans=/en/en;path=/;max-age=31536000;SameSite=Lax";
      }
      var match = document.cookie.match(/(?:^|;\\s*)googtrans=([^;]*)/);
      if (match) {
        var parts = decodeURIComponent(match[1]).split("/");
        lang = parts[parts.length - 1] || "en";
      }
    } catch (e) {}
    var select = document.querySelector("select.goog-te-combo");
    if (select) {
      var target = lang && lang !== "en" ? lang : "";
      if (select.value !== target) {
        select.value = target;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    window.dispatchEvent(new Event("venturebank:translate-ready"));
  }
  var attempts = 0;
  var timer = setInterval(function () {
    attempts++;
    if (document.querySelector("select.goog-te-combo") || attempts > 40) {
      clearInterval(timer);
      syncFromCookie();
    }
  }, 100);
};
`;

export function GoogleTranslateHead() {
  return (
    <script
      id="google-translate-callback"
      dangerouslySetInnerHTML={{ __html: INIT_SNIPPET }}
      suppressHydrationWarning
    />
  );
}
