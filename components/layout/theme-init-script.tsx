/**
 * Inline blocking script that runs BEFORE React hydrates so the page never
 * renders in the wrong theme. Reads stored preference, falls back to system.
 *
 * Must stay tiny — it's executed render-blocking on every page load.
 */
const SCRIPT = `
(function() {
  try {
    var raw = localStorage.getItem('spwa:theme');
    var stored = raw ? JSON.parse(raw) : 'system';
    var resolved = stored === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : stored;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`

export function ThemeInitScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
}
