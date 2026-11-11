import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { subscribeTrip, updateTrip } from './store'

// Live trip data + a `mutate(change)` that updates the screen instantly
// and saves in the background. Pending changes are layered on top of the
// server copy until the server copy includes them (tracked by `rev`).
export function useTrip(tripId) {
  const [server, setServer] = useState(undefined) // undefined = loading, null = not found
  const [error, setError] = useState(null)
  const [pending, setPending] = useState([])
  const serverRev = useRef(0)
  const queue = useRef(Promise.resolve())

  const prune = (list) => list.filter((p) => p.rev == null || p.rev > serverRev.current)

  useEffect(() => {
    setServer(undefined)
    setError(null)
    return subscribeTrip(
      tripId,
      (data) => {
        serverRev.current = data?.rev || 0
        setServer(data)
        setPending((list) => prune(list))
      },
      (err) => setError(err),
    )
  }, [tripId])

  const mutate = useCallback(
    (change) => {
      const entry = { change, rev: null }
      setPending((list) => [...list, entry])
      // Save one change at a time, in the order they were made.
      const saved = queue.current.then(() => updateTrip(tripId, change))
      queue.current = saved.catch(() => {})
      return saved.then(
        (rev) => {
          entry.rev = rev
          setPending((list) => prune([...list]))
        },
        (err) => {
          setPending((list) => list.filter((p) => p !== entry))
          throw err
        },
      )
    },
    [tripId],
  )

  const trip = useMemo(() => {
    const live = pending.filter((p) => p.rev == null || p.rev > (server?.rev || 0))
    if (!server || live.length === 0) return server
    const draft = structuredClone(server)
    live.forEach((p) => p.change(draft))
    return draft
  }, [server, pending])

  return { trip, error, mutate, saving: pending.some((p) => p.rev == null) }
}
