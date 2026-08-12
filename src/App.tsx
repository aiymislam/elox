import { Router, useLocation } from 'wouter'
import { CoffeeGame } from './components/coffee/CoffeeGame'
import { CoffeeIntro } from './components/coffee/CoffeeIntro'
import { IceCreamScreen } from './components/coffee/IceCreamScreen'

function AppContent() {
  const [location, setLocation] = useLocation()

  if (location === '/game') {
    return <CoffeeGame onExit={() => setLocation('/')} />
  }

  if (location === '/ice-cream') {
    return <IceCreamScreen onBack={() => setLocation('/')} />
  }

  return <CoffeeIntro onPlay={() => setLocation('/game')} />
}

export default function App() {
  return <Router><AppContent /></Router>
}
