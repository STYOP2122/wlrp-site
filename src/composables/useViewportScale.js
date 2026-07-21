import { isDesktopLayout } from '../utils/breakpoints'

/** Canonical design size — matches the layout tuned for 1920×1080. */
const REF_W = 1920
const REF_H = 1080
const MIN_SCALE = 0.55

function viewportSize() {
  const vv = window.visualViewport
  return {
    w: vv?.width ?? window.innerWidth,
    h: vv?.height ?? window.innerHeight,
  }
}

/**
 * Smaller desktops: scale .slide-content down so the page looks like 1920×1080, just smaller.
 * At 1920×1080 (or larger): scale = 1, no class, no transform — pixel-identical to today.
 */
export function applyViewportScale() {
  const sections = document.querySelectorAll('#fullpage .section')

  if (!isDesktopLayout()) {
    sections.forEach((section) => {
      section.classList.remove('wl-viewport-scaled')
      const content = section.querySelector(':scope > .slide-content')
      if (content) {
        content.style.transform = ''
        content.style.transformOrigin = ''
      }
    })
    return
  }

  const { w, h } = viewportSize()
  const scale = Math.max(MIN_SCALE, Math.min(1, w / REF_W, h / REF_H))
  const needsScale = scale < 0.999

  sections.forEach((section) => {
    const content = section.querySelector(':scope > .slide-content')
    section.classList.toggle('wl-viewport-scaled', needsScale)

    if (!content) return

    if (!needsScale) {
      content.style.transform = ''
      content.style.transformOrigin = ''
      return
    }

    content.style.transformOrigin = 'top center'
    content.style.transform = `scale(${scale})`
  })
}

export function scheduleViewportScale() {
  requestAnimationFrame(() => {
    applyViewportScale()
    window.setTimeout(applyViewportScale, 100)
    window.setTimeout(applyViewportScale, 400)
  })
}
