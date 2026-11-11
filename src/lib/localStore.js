// Demo backend used when Firebase isn't configured yet.
// Data lives in this browser's localStorage and syncs between its tabs.

const key = (id) => `trip:${id}`
const listeners = new Map() // id -> Set<fn>

function read(id) {
  try {
    const raw = localStorage.getItem(key(id))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function write(id, data) {
  localStorage.setItem(key(id), JSON.stringify(data))
  setTimeout(() => listeners.get(id)?.forEach((fn) => fn(read(id))), 0)
}

window.addEventListener('storage', (e) => {
  if (!e.key?.startsWith('trip:')) return
  const id = e.key.slice(5)
  listeners.get(id)?.forEach((fn) => fn(read(id)))
})

export function subscribeTrip(id, onData) {
  if (!listeners.has(id)) listeners.set(id, new Set())
  listeners.get(id).add(onData)
  setTimeout(() => onData(read(id)), 0)
  return () => listeners.get(id)?.delete(onData)
}

export async function createTrip(id, data) {
  write(id, { ...data, rev: 1, updatedAt: Date.now() })
}

export async function updateTrip(id, change) {
  const current = read(id)
  if (!current) throw new Error('trip-not-found')
  const trip = structuredClone(current)
  change(trip)
  trip.rev = (current.rev || 0) + 1
  trip.updatedAt = Date.now()
  write(id, trip)
  return trip.rev
}
