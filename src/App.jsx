import Home from './components/Home'
import TripPage from './components/TripPage'

export default function App() {
  const match = window.location.pathname.match(/^\/t\/([A-Za-z0-9]{20,})\/?$/)
  return match ? <TripPage tripId={match[1]} /> : <Home />
}
