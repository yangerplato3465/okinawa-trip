import * as firestore from './firestoreStore'
import * as local from './localStore'

export const isDemoMode = !import.meta.env.VITE_FIREBASE_PROJECT_ID
const backend = isDemoMode ? local : firestore

export const subscribeTrip = backend.subscribeTrip
export const createTrip = backend.createTrip
export const updateTrip = backend.updateTrip
