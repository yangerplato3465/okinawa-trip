// Remembers trips opened on this device, so the home page can link back.
const KEY = 'recentTrips'

export function loadRecent() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function rememberTrip(id, title) {
  try {
    const list = loadRecent().filter((t) => t.id !== id)
    list.unshift({ id, title, openedAt: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 10)))
  } catch {
    /* storage unavailable — not important */
  }
}
