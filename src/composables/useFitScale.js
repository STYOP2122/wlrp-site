import { nextTick, onMounted, onUnmounted } from 'vue'

/**
 * Soft fit: shrink content so it fits inside the section.
 * @param {string} sectionSelector
 * @param {string} contentSelector
 * @param {{ minScale?: number }} [options]
 */
export function useFitScale(sectionSelector, contentSelector, options = {}) {
  const minScale = options.minScale ?? 0.88
  let raf = 0

  function fit() {
    const section = document.querySelector(sectionSelector)
    const content = document.querySelector(contentSelector)
    if (!section || !content) return

    content.style.transform = 'none'

    const available = section.clientHeight
    const needed = content.scrollHeight
    if (!available || !needed) return

    if (needed <= available - 16) {
      content.style.transform = 'none'
      return
    }

    const raw = (available - 16) / needed
    const scale = Math.max(minScale, Math.min(1, raw))
    content.style.transformOrigin = 'top center'
    content.style.transform = `scale(${scale})`
  }

  function schedule() {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      fit()
      window.setTimeout(fit, 80)
      window.setTimeout(fit, 350)
    })
  }

  onMounted(async () => {
    await nextTick()
    schedule()
    window.addEventListener('resize', schedule)
    window.addEventListener('load', schedule)
  })

  onUnmounted(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', schedule)
    window.removeEventListener('load', schedule)
  })

  return { refit: schedule }
}
