import { useState } from 'react'
import { Router, useLocation } from 'wouter'
import { GameAuth } from './components/GameAuth'
import { CoffeeGame } from './components/coffee/CoffeeGame'
import { CoffeeIntro } from './components/coffee/CoffeeIntro'
import { IceCreamScreen } from './components/coffee/IceCreamScreen'
import { Language, readLanguage, saveLanguage } from './lib/i18n'
import { LatestUpdatesPage } from './pages/LatestUpdatesPage'

function AppContent() {
  const [location, setLocation] = useLocation()
  const [language, setLanguage] = useState<Language>(() => readLanguage())

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage)
    saveLanguage(nextLanguage)
  }

  if (location === '/game') {
    return <CoffeeGame language={language} onLanguageChange={handleLanguageChange} onExit={() => setLocation('/')} />
  }

  if (location === '/ice-cream') {
    return <IceCreamScreen onBack={() => setLocation('/')} />
  }

  if (location === '/register') {
    return <GameAuth onBack={() => setLocation('/')} onGuest={() => setLocation('/game')} onSuccess={() => setLocation('/game')} />
  }

  if (location === '/updates') {
    return <LatestUpdatesPage />
  }

  return <CoffeeIntro language={language} onLanguageChange={handleLanguageChange} />
}

export default function App() {
  return <Router><AppContent /></Router>
}
