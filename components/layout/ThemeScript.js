/**
 * Prevents flash of wrong theme before React hydrates (next-themes pattern).
 */
export function ThemeScript() {
  const code = `
(function () {
  var key = 'venturebank-theme';
  try {
    var stored = localStorage.getItem(key);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var useDark = stored === 'dark' || ((stored === 'system' || !stored) && prefersDark);
    document.documentElement.classList.toggle('dark', useDark);
  } catch (e) {}
})();
`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: code }}
      suppressHydrationWarning
    />
  );
}
