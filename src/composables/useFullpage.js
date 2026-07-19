import { nextTick, onMounted, onUnmounted } from 'vue'
import fullpage from 'fullpage.js'
import { FULLPAGE_LICENSE } from '../config/servers'

const ANCHORS = ['home', 'about-the-project', 'How-to-start-playing', 'news', 'footer']

function isDesktopFullpage() {
  return (
    window.matchMedia('all and (min-width: 1367px)').matches &&
    window.matchMedia('all and (min-height: 797px)').matches
  )
}

function clearLocationHash() {
  const { pathname, search } = window.location
  if (window.location.hash || window.location.href.includes('?#')) {
    window.history.replaceState(null, '', pathname + search)
  }
}

function scrollToSection(anchorOrIndex) {
  let el = null
  if (typeof anchorOrIndex === 'number') {
    const sections = document.querySelectorAll('#fullpage .section')
    el = sections[anchorOrIndex - 1] || sections[anchorOrIndex] || null
  } else {
    el =
      document.querySelector(`#fullpage .section[data-anchor="${anchorOrIndex}"]`) ||
      document.getElementById(anchorOrIndex)
  }
  if (!el) return
  const headerOffset = 72
  const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
}

export function goToSection(anchorOrIndex) {
  if (isDesktopFullpage() && window.fullpage_api) {
    window.fullpage_api.moveTo(anchorOrIndex)
    return
  }
  scrollToSection(anchorOrIndex)
}

export function useFullpage(containerSelector = '#fullpage') {
  let initialized = false
  let wasDesktop = null

  function destroy() {
    if (window.fullpage_api) {
      try {
        window.fullpage_api.destroy('all')
      } catch {
        // already destroyed
      }
    }
    initialized = false
  }

  function resetSectionStyles() {
    document.querySelectorAll('#fullpage .section').forEach((section) => {
      section.style.height = ''
      section.style.overflow = ''
    })
  }

  function init() {
    const el = document.querySelector(containerSelector)
    if (!el) return

    destroy()
    clearLocationHash()
    const desktop = isDesktopFullpage()
    wasDesktop = desktop

    // Allow normal page scroll when fullpage auto-scroll is off
    document.documentElement.style.overflow = desktop ? 'hidden' : ''
    document.body.style.overflow = desktop ? 'hidden' : ''
    document.documentElement.style.height = desktop ? '100%' : ''
    document.body.style.height = desktop ? '100%' : ''

    if (!desktop) {
      resetSectionStyles()
    }

    fullpage(containerSelector, {
      licenseKey: FULLPAGE_LICENSE,
      autoScrolling: desktop,
      fitToSection: desktop,
      navigation: desktop,
      scrollHorizontally: false,
      loopHorizontal: false,
      continuousHorizontal: false,
      scrollOverflow: false,
      navigationPosition: 'right',
      anchors: ANCHORS,
      lockAnchors: true,
      recordHistory: false,
      animateAnchor: false,
      menu: '#myMenu',
      credits: { enabled: false },
      afterRender() {
        if (!isDesktopFullpage()) {
          resetSectionStyles()
          return
        }
        document.querySelectorAll('#fullpage .section').forEach((section) => {
          section.style.height = `${window.innerHeight}px`
          section.style.overflow = section.classList.contains('content__slide_home')
            ? 'visible'
            : 'hidden'
        })
        window.fullpage_api?.reBuild()
        window.dispatchEvent(new Event('resize'))
      },
      afterLoad(_origin, destination) {
        if (!isDesktopFullpage()) return
        window.dispatchEvent(new Event('resize'))
        if (destination?.anchor === 'footer') {
          window.dispatchEvent(new Event('resize'))
        }
      },
    })
    initialized = true
    clearLocationHash()
    window.setTimeout(() => {
      if (!isDesktopFullpage()) {
        resetSectionStyles()
        return
      }
      window.fullpage_api?.reBuild()
      window.dispatchEvent(new Event('resize'))
    }, 300)
  }

  function onResize() {
    if (!document.querySelector(containerSelector)) return
    const desktop = isDesktopFullpage()
    if (!initialized) {
      init()
      return
    }
    if (desktop && wasDesktop) {
      window.fullpage_api?.reBuild()
    } else if (desktop !== wasDesktop) {
      init()
    }
    wasDesktop = desktop
  }

  onMounted(async () => {
    await nextTick()
    requestAnimationFrame(() => init())
    window.addEventListener('resize', onResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
    destroy()
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.documentElement.style.height = ''
    document.body.style.height = ''
  })

  return { reinit: init }
}
