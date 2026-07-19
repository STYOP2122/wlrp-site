/** Shared layout gate: desktop = not phone/tablet. */
export const DESKTOP_MQ = '(min-width: 1025px)'

export function isDesktopLayout() {
  return typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches
}
