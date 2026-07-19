/** Public asset URL that respects Vite `base` (GitHub Pages `/wlrp-site/`). */
export function asset(path) {
  const base = import.meta.env.BASE_URL || '/'
  const clean = String(path || '').replace(/^\/+/, '')
  return `${base.endsWith('/') ? base : `${base}/`}${clean}`
}
