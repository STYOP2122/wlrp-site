import { isDesktopLayout } from '../utils/breakpoints'

/** Canonical design size — matches the layout tuned for 1920×1080. */
const REF_W = 1920
const REF_H = 1080
const MIN_SCALE = 0.55

/** Every visual layer inside a section — must scale together. */
const SECTION_LAYERS = ':scope > .pxl, :scope > .bg-play, :scope > .slide-content'

function viewportSize() {
  const vv = window.visualViewport
  return {
    w: vv?.width ?? window.innerWidth,
    h: vv?.height ?? window.innerHeight,
  }
}

function clearLayerStyles(layer) {
  layer.style.transform = ''
  layer.style.transformOrigin = ''
}

/**
 * Smaller desktops: scale all section layers together (bg + content).
 * At 1920×1080: scale = 1, no transform — identical to the reference layout.
 */
export function applyViewportScale() {
  const sections = document.querySelectorAll('#fullpage .section')

  if (!isDesktopLayout()) {
    sections.forEach((section) => {
      section.classList.remove('wl-viewport-scaled')
      section.querySelectorAll(SECTION_LAYERS).forEach(clearLayerStyles)
    })
    return
  }

  const { w, h } = viewportSize()
  const scale = Math.max(MIN_SCALE, Math.min(1, w / REF_W, h / REF_H))
  const needsScale = scale < 0.999

  sections.forEach((section) => {
    const layers = section.querySelectorAll(SECTION_LAYERS)
    section.classList.toggle('wl-viewport-scaled', needsScale)

    layers.forEach((layer) => {
      if (!needsScale) {
        clearLayerStyles(layer)
        return
      }
      layer.style.transformOrigin = 'top center'
      layer.style.transform = `scale(${scale})`
    })
  })
}

export function scheduleViewportScale() {
  requestAnimationFrame(() => {
    applyViewportScale()
    window.setTimeout(applyViewportScale, 100)
    window.setTimeout(applyViewportScale, 400)
  })
}
