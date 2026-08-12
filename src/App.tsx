import { Router, useLocation } from 'wouter'
import { GameAuth } from './components/GameAuth'
import { CoffeeGame } from './components/coffee/CoffeeGame'
import { CoffeeIntro } from './components/coffee/CoffeeIntro'
import { IceCreamScreen } from './components/coffee/IceCreamScreen'
import { LatestUpdatesPage } from './pages/LatestUpdatesPage'

function AppContent() {
  const [location, setLocation] = useLocation()

  if (location === '/game') {
    return <CoffeeGame onExit={() => setLocation('/')} />
  }

  if (location === '/ice-cream') {
    return <IceCreamScreen onBack={() => setLocation('/')} />
  }

  if (location === '/register') {
    return <GameAuth onBack={() => setLocation('/')} onGuest={() => setLocation('/game')} />
  }

  if (location === '/updates') {
    return <LatestUpdatesPage />
  }

  return <CoffeeIntro onPlay={() => setLocation('/game')} />
}

export default function App() {
  return <Router><AppContent /></Router>
}
