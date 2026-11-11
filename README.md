# 沖繩家族旅行 — shared trip planner

A tiny web app where everyone with the link can edit the itinerary together.
No accounts. Drag activities between days, drag whole days to swap them.
UI is in Traditional Chinese.

**Stack:** React + Vite · Firebase Firestore (live sync) · Firebase Hosting — all free tier.

## Try it locally (no setup)

```bash
npm install
npm run dev
```

Open http://localhost:5173 and click **建立沖繩行程**. Without Firebase config the app runs in
*demo mode*: data is saved in this browser only (open two tabs to see live sync).

## Put it online (one-time, ~10 minutes)

1. **Create a Firebase project** at https://console.firebase.google.com (free Spark plan; skip Analytics).
2. **Create the database:** Build → Firestore Database → Create database → *Production mode*.
   Pick region `asia-northeast1 (Tokyo)` or one near your family.
3. **Register a web app:** Project settings (⚙) → Your apps → `</>` Web. Copy the config values.
4. **Add the config:** copy `.env.example` to `.env.local` and fill in the four values.
   (These are public identifiers, not secrets — security comes from `firestore.rules`.)
5. **Deploy:**
   ```bash
   npx firebase-tools login
   npx firebase-tools use --add     # pick your project
   npm run deploy                   # builds, uploads the site + database rules
   ```
6. Open `https://<your-project>.web.app`, click **建立沖繩行程**, then **分享連結** and
   send the link to the family group chat.

## How the "secret link" works

Each trip is one Firestore document at `trips/{tripId}`, where `tripId` is a random 22-character
string (~130 bits). `firestore.rules` lets anyone read/write a trip **only if they know its exact
ID**, and blocks listing or deleting trips. So: anyone with the link can edit, nobody else can find it.
Only share it with people on the trip.

## Notes

- Simultaneous edits are safe: each change is saved in a Firestore transaction, so two people
  dragging at the same time won't overwrite each other.
- Deleted activities/days go to **最近刪除** at the bottom of the page and can be restored.
- Changing **出發日** shifts every date; days themselves are just an ordered list.
- The draft schedule that new trips start with is in `src/lib/sampleTrip.js`.
