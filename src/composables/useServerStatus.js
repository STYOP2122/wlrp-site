import { onMounted, onUnmounted, ref } from 'vue'
import { POLL_INTERVAL_MS, SERVERS } from '../config/servers'

function baseState(server) {
  return {
    ...server,
    address: server.fallbackIp,
    playersLabel: '',
    lineWidth: '0%',
    offline: false,
  }
}

function splitAddress(fallbackIp) {
  const [host, port = '7777'] = String(fallbackIp).split(':')
  return { host, port }
}

function apiUrl(host, port) {
  const base = import.meta.env.BASE_URL || '/'
  const path = `${base}api/samp-status`.replace(/\/{2,}/g, '/')
  return `${path}?host=${encodeURIComponent(host)}&port=${encodeURIComponent(port)}`
}

/** Local Vite/Node UDP API (dev + preview). */
async function fetchViaLocalApi(host, port, signal) {
  const response = await fetch(apiUrl(host, port), { signal })
  if (!response.ok) throw new Error(`local api ${response.status}`)
  return response.json()
}

/** Public SAMonitor HTTP API — works on static GitHub Pages. */
async function fetchViaSAMonitor(host, port, signal) {
  const ip = `${host}:${port}`
  const response = await fetch(
    `https://sam.markski.ar/api/GetServerByIP?ip_addr=${encodeURIComponent(ip)}`,
    { signal },
  )
  if (!response.ok) throw new Error(`samonitor ${response.status}`)
  const data = await response.json()
  if (!data?.success) throw new Error('samonitor offline')
  return {
    online: true,
    players: Number(data.playersOnline) || 0,
    maxplayers: Number(data.maxPlayers) || 0,
    hostname: data.name || '',
    gamemode: data.gameMode || '',
    language: data.language || '',
    password: Boolean(data.requiresPassword),
  }
}

async function fetchSampStatus(server, signal) {
  const { host, port } = splitAddress(server.fallbackIp)
  try {
    const local = await fetchViaLocalApi(host, port, signal)
    if (local?.online) return local
  } catch {
    // GitHub Pages / static host — use public API
  }
  return fetchViaSAMonitor(host, port, signal)
}

export function useServerStatus() {
  const servers = ref(SERVERS.map(baseState))
  let timer = null
  let abort = null

  async function poll() {
    abort?.abort()
    abort = new AbortController()
    const { signal } = abort

    const results = await Promise.all(
      SERVERS.map(async (server) => {
        const base = baseState(server)
        try {
          const info = await fetchSampStatus(server, signal)
          if (!info?.online) {
            return {
              ...base,
              playersLabel: 'offline',
              lineWidth: '0%',
              offline: true,
            }
          }

          const players = Number(info.players) || 0
          const maxplayers = Number(info.maxplayers) || 0
          const width = maxplayers ? Math.min(100, (players / maxplayers) * 100) : 0

          return {
            ...base,
            playersLabel: `${players} / ${maxplayers}`,
            lineWidth: `${width}%`,
            offline: false,
            hostname: info.hostname || server.title,
          }
        } catch (err) {
          if (err?.name === 'AbortError') return base
          return {
            ...base,
            playersLabel: 'offline',
            lineWidth: '0%',
            offline: true,
          }
        }
      }),
    )

    if (!signal.aborted) servers.value = results
  }

  onMounted(() => {
    poll()
    timer = window.setInterval(poll, POLL_INTERVAL_MS)
  })

  onUnmounted(() => {
    if (timer) window.clearInterval(timer)
    abort?.abort()
  })

  return { servers }
}
