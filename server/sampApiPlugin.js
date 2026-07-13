import { querySampInfo } from './sampQuery.js'

function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function parseUrl(reqUrl) {
  const u = new URL(reqUrl, 'http://localhost')
  return {
    host: u.searchParams.get('host') || '',
    port: u.searchParams.get('port') || '7777',
  }
}

async function handleSampStatus(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.end()
    return
  }

  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const { host, port } = parseUrl(req.url || '/')
    if (!host) {
      sendJson(res, 400, { online: false, error: 'host is required' })
      return
    }

    const info = await querySampInfo(host, port)
    sendJson(res, 200, info)
  } catch (err) {
    sendJson(res, 200, {
      online: false,
      players: 0,
      maxplayers: 0,
      error: err?.message || 'query failed',
    })
  }
}

/** Vite plugin: /api/samp-status?host=&port= */
export function sampStatusPlugin() {
  const mount = (middlewares) => {
    middlewares.use('/api/samp-status', (req, res) => {
      handleSampStatus(req, res)
    })
  }

  return {
    name: 'samp-status-api',
    configureServer(server) {
      mount(server.middlewares)
    },
    configurePreviewServer(server) {
      mount(server.middlewares)
    },
  }
}
