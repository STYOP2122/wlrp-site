export function initYandexMetrika(id = 53059735) {
  if (typeof window === 'undefined') return
  if (window.ym) {
    window.ym(id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    })
    return
  }

  ;(function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        ;(m[i].a = m[i].a || []).push(arguments)
      }
    m[i].l = 1 * new Date()
    k = e.createElement(t)
    a = e.getElementsByTagName(t)[0]
    k.async = 1
    k.src = r
    a.parentNode.insertBefore(k, a)
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')

  window.ym(id, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  })
}

export function youtubeEmbedUrl(watchUrl) {
  try {
    const url = new URL(watchUrl)
    const id = url.searchParams.get('v')
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`
  } catch {
    // fall through
  }
  return watchUrl
}
