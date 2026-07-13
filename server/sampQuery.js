import dgram from 'node:dgram'
import dns from 'node:dns/promises'

/**
 * SA-MP / open.mp UDP query (opcode "i" — server info).
 * @see https://open.mp/docs/tutorials/QueryMechanism
 */
export async function querySampInfo(host, port = 7777, timeoutMs = 3500) {
  const address = await resolveHost(host)
  const portNum = Number(port) || 7777

  const ipParts = address.split('.').map((n) => Number(n))
  if (ipParts.length !== 4 || ipParts.some((n) => Number.isNaN(n))) {
    throw new Error(`Invalid IPv4 address: ${address}`)
  }

  const packet = Buffer.alloc(11)
  packet.write('SAMP', 0, 4, 'ascii')
  packet[4] = ipParts[0]
  packet[5] = ipParts[1]
  packet[6] = ipParts[2]
  packet[7] = ipParts[3]
  packet[8] = portNum & 0xff
  packet[9] = (portNum >> 8) & 0xff
  packet[10] = 'i'.charCodeAt(0)

  const data = await udpRequest(address, portNum, packet, timeoutMs)
  return parseInfoResponse(data)
}

async function resolveHost(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return host
  const { address } = await dns.lookup(host, { family: 4 })
  return address
}

function udpRequest(host, port, packet, timeoutMs) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket('udp4')
    let settled = false

    const finish = (err, data) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      try {
        socket.close()
      } catch {
        // ignore
      }
      if (err) reject(err)
      else resolve(data)
    }

    const timer = setTimeout(() => finish(new Error('SAMP query timeout')), timeoutMs)

    socket.on('error', (err) => finish(err))
    socket.on('message', (msg) => finish(null, msg))
    socket.send(packet, port, host, (err) => {
      if (err) finish(err)
    })
  })
}

function parseInfoResponse(buf) {
  if (!buf || buf.length < 11 || buf.subarray(0, 4).toString('ascii') !== 'SAMP') {
    throw new Error('Invalid SAMP response')
  }

  let offset = 11
  const password = Boolean(buf.readUInt8(offset))
  offset += 1
  const players = buf.readUInt16LE(offset)
  offset += 2
  const maxplayers = buf.readUInt16LE(offset)
  offset += 2

  const hostname = readDynString(buf, offset)
  offset = hostname.next
  const gamemode = readDynString(buf, offset)
  offset = gamemode.next
  const language = readDynString(buf, offset)

  return {
    online: true,
    password,
    players,
    maxplayers,
    hostname: hostname.value,
    gamemode: gamemode.value,
    language: language.value,
  }
}

function readDynString(buf, offset) {
  if (offset + 4 > buf.length) return { value: '', next: offset }
  const len = buf.readUInt32LE(offset)
  offset += 4
  const end = Math.min(offset + len, buf.length)
  const value = buf.subarray(offset, end).toString('latin1')
  return { value, next: end }
}
