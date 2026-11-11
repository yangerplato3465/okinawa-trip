import { initializeApp } from 'firebase/app'
import { doc, getFirestore, onSnapshot, runTransaction, setDoc } from 'firebase/firestore'

let db
function getDb() {
  if (!db) {
    const app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    })
    db = getFirestore(app)
  }
  return db
}

const tripRef = (id) => doc(getDb(), 'trips', id)

export function subscribeTrip(id, onData, onError) {
  return onSnapshot(
    tripRef(id),
    (snap) => onData(snap.exists() ? snap.data() : null),
    onError,
  )
}

export async function createTrip(id, data) {
  await setDoc(tripRef(id), { ...data, rev: 1, updatedAt: Date.now() })
}

// Read the latest version, apply the change, write it back — atomically.
// If someone else saved in between, Firestore retries with their version.
export function updateTrip(id, change) {
  return runTransaction(getDb(), async (tx) => {
    const ref = tripRef(id)
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error('trip-not-found')
    const trip = structuredClone(snap.data())
    change(trip)
    trip.rev = (snap.data().rev || 0) + 1
    trip.updatedAt = Date.now()
    tx.set(ref, trip)
    return trip.rev
  })
}
