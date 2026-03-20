/**
 * Cursor .cur files in public/cursors/ — injected so webpack doesn't resolve urls().
 *
 * Matches "Windows XP Classic Complete Edition" naming (default_*.cur).
 * Edit paths here if your filenames differ.
 */
function publicAsset(path) {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const p = path.replace(/^\//, '');
  return base ? `${base}/${p}` : `/${p}`;
}

export function injectXpCursorVars() {
  const style = document.createElement('style');
  style.setAttribute('data-xp-cursors', 'vars');
  style.textContent = `
:root {
  --xp-cursor-default: url("${publicAsset('cursors/default_arrow.cur')}"), auto;
  --xp-cursor-pointer: url("${publicAsset('cursors/default_link.cur')}"), pointer;
  --xp-cursor-text: url("${publicAsset('cursors/default_beam.cur')}"), text;
  --xp-cursor-busy: url("${publicAsset('cursors/default_busy.cur')}"), wait;
  --xp-cursor-wait: url("${publicAsset('cursors/default_wait.cur')}"), wait;
  --xp-cursor-help: url("${publicAsset('cursors/default_helpsel.cur')}"), help;
}
`;
  document.head.appendChild(style);
}
