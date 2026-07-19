import { nextTick, onMounted, onUnmounted } from 'vue'
import Parallax from 'parallax-js'
import { isDesktopLayout } from '../utils/breakpoints'

export function useParallax(ids = ['scene', 'scene2']) {
  const instances = []

  function destroy() {
    while (instances.length) {
      const inst = instances.pop()
      try {
        inst.disable()
        inst.destroy()
      } catch {
        // ignore
      }
    }
  }

  function init() {
    destroy()
    if (!isDesktopLayout()) return

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      instances.push(new Parallax(el))
    })
  }

  function onResize() {
    init()
  }

  onMounted(async () => {
    await nextTick()
    requestAnimationFrame(() => init())
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    destroy()
  })
}
