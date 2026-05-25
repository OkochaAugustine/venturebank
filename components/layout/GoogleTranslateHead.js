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
  window.setTimeout(function () {
    var lang = "en";
    try {
      var match = document.cookie.match(/(?:^|;\\s*)googtrans=([^;]*)/);
      if (match) {
        var parts = decodeURIComponent(match[1]).split("/");
        lang = parts[parts.length - 1] || "en";
      }
    } catch (e) {}
    if (lang && lang !== "en") {
      var select = document.querySelector("select.goog-te-combo");
      if (select) {
        select.value = lang;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    window.dispatchEvent(new Event("venturebank:translate-ready"));
  }, 300);
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
