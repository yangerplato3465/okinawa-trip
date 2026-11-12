// Every change to a trip is a small function that edits a copy of the trip.
// The same function runs locally (instant UI) and inside a database
// transaction (so two people editing at once never overwrite each other).
// They look things up by id and are safe to apply twice.

const TRASH_LIMIT = 30

function findItem(trip, itemId) {
  for (const day of trip.days) {
    const index = day.items.findIndex((it) => it.id === itemId)
    if (index !== -1) return { day, index }
  }
  return null
}

const findDay = (trip, dayId) => trip.days.find((d) => d.id === dayId)

function pushTrash(trip, entry) {
  trip.trash = [{ ...entry, deletedAt: Date.now() }, ...(trip.trash || [])].slice(0, TRASH_LIMIT)
}

export const setTitle = (title) => (trip) => {
  trip.title = title
}

export const setStartDate = (startDate) => (trip) => {
  trip.startDate = startDate
}

export const addDay = (dayId) => (trip) => {
  if (!findDay(trip, dayId)) trip.days.push({ id: dayId, title: '', items: [] })
}

export const updateDay = (dayId, patch) => (trip) => {
  const day = findDay(trip, dayId)
  if (day) Object.assign(day, patch)
}

export const deleteDay = (dayId, label) => (trip) => {
  const index = trip.days.findIndex((d) => d.id === dayId)
  if (index === -1) return
  const [day] = trip.days.splice(index, 1)
  pushTrash(trip, { kind: 'day', id: day.id, day, index, label })
}

// Moves a day's activities to another date. Hotels are booked per night,
// so each hotel stays on its date instead of travelling with the activities.
export const moveDay = (dayId, toIndex) => (trip) => {
  const index = trip.days.findIndex((d) => d.id === dayId)
  if (index === -1) return
  const hotels = trip.days.map((d) => d.hotel ?? null)
  const [day] = trip.days.splice(index, 1)
  trip.days.splice(Math.min(toIndex, trip.days.length), 0, day)
  trip.days.forEach((d, i) => {
    d.hotel = hotels[i]
  })
}

// hotel: { name, note } or null to clear
export const setHotel = (dayId, hotel) => (trip) => {
  const day = findDay(trip, dayId)
  if (day) day.hotel = hotel
}

export const addItem = (dayId, item) => (trip) => {
  const day = findDay(trip, dayId)
  if (day && !findItem(trip, item.id)) day.items.push(item)
}

export const updateItem = (itemId, patch) => (trip) => {
  const found = findItem(trip, itemId)
  if (found) Object.assign(found.day.items[found.index], patch)
}

export const deleteItem = (itemId, label) => (trip) => {
  const found = findItem(trip, itemId)
  if (!found) return
  const [item] = found.day.items.splice(found.index, 1)
  pushTrash(trip, { kind: 'item', id: item.id, item, dayId: found.day.id, index: found.index, label })
}

export const moveItem = (itemId, toDayId, toIndex) => (trip) => {
  const found = findItem(trip, itemId)
  const target = findDay(trip, toDayId)
  if (!found || !target) return
  const [item] = found.day.items.splice(found.index, 1)
  target.items.splice(Math.min(toIndex, target.items.length), 0, item)
}

export const restore = (entryId) => (trip) => {
  const trash = trip.trash || []
  const k = trash.findIndex((e) => e.id === entryId)
  if (k === -1) return
  const [entry] = trash.splice(k, 1)
  trip.trash = trash

  if (entry.kind === 'day') {
    if (!findDay(trip, entry.day.id)) {
      trip.days.splice(Math.min(entry.index, trip.days.length), 0, entry.day)
    }
    return
  }
  if (findItem(trip, entry.item.id)) return
  let day = findDay(trip, entry.dayId) || trip.days[trip.days.length - 1]
  if (!day) {
    day = { id: entry.dayId, title: '', items: [] }
    trip.days.push(day)
  }
  day.items.splice(Math.min(entry.index, day.items.length), 0, entry.item)
}

// ---------- packing list ("要帶的東西") ----------

export const addPacking = (item) => (trip) => {
  trip.packing = trip.packing || []
  if (!trip.packing.some((p) => p.id === item.id)) trip.packing.push(item)
}

export const updatePacking = (id, patch) => (trip) => {
  const item = (trip.packing || []).find((p) => p.id === id)
  if (item) Object.assign(item, patch)
}

export const deletePacking = (id) => (trip) => {
  trip.packing = (trip.packing || []).filter((p) => p.id !== id)
}

export const restorePacking = (item, index) => (trip) => {
  trip.packing = trip.packing || []
  if (!trip.packing.some((p) => p.id === item.id)) {
    trip.packing.splice(Math.min(index, trip.packing.length), 0, item)
  }
}

// ---------- per-day food shortlist ("美食備選名單") ----------
// Lives on the day, so it travels with the day's activities when days are reordered.

const foodOf = (trip, dayId) => {
  const day = findDay(trip, dayId)
  if (day && !day.food) day.food = []
  return day?.food
}

export const addFood = (dayId, item) => (trip) => {
  const food = foodOf(trip, dayId)
  if (food && !food.some((f) => f.id === item.id)) food.push(item)
}

export const updateFood = (dayId, id, patch) => (trip) => {
  const item = foodOf(trip, dayId)?.find((f) => f.id === id)
  if (item) Object.assign(item, patch)
}

export const deleteFood = (dayId, id) => (trip) => {
  const day = findDay(trip, dayId)
  if (day) day.food = (day.food || []).filter((f) => f.id !== id)
}

export const restoreFood = (dayId, item, index) => (trip) => {
  const food = foodOf(trip, dayId)
  if (food && !food.some((f) => f.id === item.id)) food.splice(Math.min(index, food.length), 0, item)
}
