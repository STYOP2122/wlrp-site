import { nextTick, onMounted, onUnmounted } from 'vue'
import Parallax from 'parallax-js'

function isDesktopFullpage() {
  return (
    window.matchMedia('all and (min-width: 1367px)').matches &&
    window.matchMedia('all and (min-height: 797px)').matches
  )
}

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
    if (!isDesktopFullpage()) return

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
