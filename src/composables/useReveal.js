import { onMounted, onUnmounted } from 'vue'

/**
 * Applies revealator CSS classes via Intersection Observer
 * (replaces fm.revealator.jquery without changing visual CSS).
 */
export function useReveal(rootSelector = '.layout') {
  let observer = null

  function reveal(el) {
    el.classList.add('revealator-within')
    el.style.transform = 'translate(0, 0)'
    el.style.opacity = '1'
    el.style.zIndex = '1'
    if (el.classList.contains('revealator-once')) {
      observer?.unobserve(el)
    }
  }

  onMounted(() => {
    const root = document.querySelector(rootSelector) || document.body
    const targets = root.querySelectorAll(
      '[class*="revealator-slide"], [class*="revealator-fade"]',
    )

    // Match original onload behavior for first-screen slide-right elements
    root.querySelectorAll('.revealator-slideright').forEach((el) => {
      el.style.transform = 'translate(0, 0)'
      el.style.opacity = '1'
      el.style.zIndex = '1'
    })

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target)
        })
      },
      { threshold: 0.15 },
    )

    targets.forEach((el) => observer.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
}
