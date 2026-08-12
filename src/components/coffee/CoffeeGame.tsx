import type { DragEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { BREW_TIME, GAME_SECONDS, TARGET_ORDERS, fillLevel, ingredientIcon, ingredientName, makeOrder, makeStation, sameRecipe } from '../../lib/coffeeGame'
import type { Ingredient, Order, Station } from '../../lib/coffeeGame'
import { BrewStation } from './BrewStation'
import { OrderTicket } from './OrderTicket'

type ProductMode = 'coffee' | 'iceCream'

export function CoffeeGame({ onExit }: { onExit: () => void }) {
  const [orders, setOrders] = useState<Order[]>(() => [makeOrder(), makeOrder(), makeOrder()])
  const [stations, setStations] = useState<Station[]>(() => [makeStation(), makeStation(), makeStation()])
  const [selected, setSelected] = useState(0)
  const [score, setScore] = useState(0)
  const [served, setServed] = useState(0)
  const [productMode, setProductMode] = useState<ProductMode>('coffee')
  const [now, setNow] = useState(Date.now())
  const [endAt] = useState(() => Date.now() + GAME_SECONDS * 1000)
  const [message, setMessage] = useState('Build an order, then start the brewer.')
  const finished = now >= endAt || served >= TARGET_ORDERS
  const seconds = Math.max(0, Math.ceil((endAt - now) / 1000))
  const finalScore = score + (served >= TARGET_ORDERS ? seconds * 20 : 0)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 80)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    setStations((current) => current.map((station) => station.status === 'brewing' && station.startedAt && now - station.startedAt > BREW_TIME * 1.12 ? { ...station, status: 'overflow' } : station))
  }, [now])

  const startBrew = (stationIndex: number, station: Station, order: Order) => {
    setStations((current) => current.map((item, index) => index === stationIndex ? { ...station, orderId: order.id, startedAt: Date.now(), status: 'brewing' } : item))
    setOrders((current) => current.map((item) => item.id === order.id ? makeOrder() : item))
    setMessage('Ice cream is mixing—watch the cone!')
  }
  const addIngredient = (ingredient: Ingredient, stationIndex = selected) => {
    let nextStation: Station | null = null
    setSelected(stationIndex)
    setStations((current) => current.map((station, index) => {
      if (index !== stationIndex || station.status !== 'empty') return station
      nextStation = { ...station, recipe: { ...station.recipe, [ingredient]: Math.min(2, station.recipe[ingredient] + 1) } }
      return nextStation
    }))
    window.setTimeout(() => {
      const brewedStation = nextStation
      if (!brewedStation) return
      const order = orders.find((item) => sameRecipe(item, brewedStation.recipe))
      if (order) startBrew(stationIndex, brewedStation, order)
    }, 0)
  }
  const dragIngredient = (event: DragEvent<HTMLButtonElement>, ingredient: Ingredient) => {
    event.dataTransfer.setData('ingredient', ingredient)
    event.dataTransfer.effectAllowed = 'copy'
  }
  const clearStation = (index: number) => setStations((current) => current.map((station, item) => item === index ? makeStation() : station))
  const brew = (index: number) => {
    const nextMode = productMode === 'coffee' ? 'iceCream' : 'coffee'
    setProductMode(nextMode)
    setMessage(nextMode === 'iceCream' ? 'Ice cream is ready! Press MAKE again for coffee.' : 'Coffee mode is back. Build a ticket to brew.')
    if (nextMode === 'iceCream') return
    const station = stations[index]
    const order = orders.find((item) => sameRecipe(item, station.recipe))
    if (!order) { setMessage('No ticket matches that drink. Check the recipe.'); return }
    startBrew(index, station, order)
  }
  const serve = (index: number) => {
    const station = stations[index]
    const level = fillLevel(station, now)
    if (station.status !== 'brewing') return
    const points = Math.max(250, Math.round(1000 - Math.abs(1 - level) * 2400))
    setScore((current) => current + points); setServed((current) => current + 1)
    setMessage(level >= .82 ? `Perfect timing! +${points}` : `A little early. +${points}`); clearStation(index)
  }
  const toggleProductMode = () => {
    const nextMode = productMode === 'coffee' ? 'iceCream' : 'coffee'
    setProductMode(nextMode)
    setMessage(nextMode === 'iceCream' ? 'Ice cream mode is on.' : 'Coffee mode is on.')
  }
  const progress = useMemo(() => Math.min(100, served / TARGET_ORDERS * 100), [served])

  if (finished) return <main className="coffee-result"><section><p>Shift complete</p><h1>{served >= TARGET_ORDERS ? 'Brilliant service!' : 'Closing time'}</h1><div className="final-score"><span>Score</span><b>{finalScore.toLocaleString()}</b></div><p>You served {served} of {TARGET_ORDERS} orders.</p><button onClick={() => window.location.reload()}>Play again</button><button className="exit-link" onClick={onExit}>Back to menu</button></section></main>

  return <main className="coffee-game">
    <header><button onClick={onExit}>‹ MENU</button><div className="brand">MORNING <em>RUSH</em></div><div className="game-stats"><span>SCORE <b>{score.toLocaleString()}</b></span><span>TIME <b>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</b></span></div></header>
    <div className="target-bar"><span style={{ width: `${progress}%` }} /><p>{served} / {TARGET_ORDERS} orders served</p></div>
    <section className="cafe-counter">
      <div className="ticket-rail">{orders.map((order, index) => <OrderTicket key={order.id} order={order} number={served + index + 1} />)}</div>
      <button className={`ice-cream-highlight ${productMode === 'iceCream' ? 'active' : ''}`} onClick={toggleProductMode}>
        <p>{productMode === 'iceCream' ? 'Ice cream mode' : 'Coffee mode'}</p>
        <span>🍦 Vanilla · 🍓 Strawberry · 🍫 Chocolate</span>
      </button>
      <div className="shelf"><div className="ingredient-jars">{(['vanilla', 'strawberry', 'chocolate'] as Ingredient[]).map((item) => <button key={item} draggable onDragStart={(event) => dragIngredient(event, item)} onClick={() => addIngredient(item)}><i className={item}>{ingredientIcon[item]}</i><b>{ingredientName[item]}</b><small>drag or tap</small></button>)}</div></div>
      <div className="stations">{stations.map((station, index) => <BrewStation key={index} station={station} now={now} index={index} selected={selected === index} productMode={productMode} onSelect={() => setSelected(index)} onMake={() => brew(index)} onServe={() => serve(index)} onTrash={() => clearStation(index)} onDropIngredient={(ingredient) => addIngredient(ingredient, index)} />)}</div>
    </section>
    <footer><button onClick={() => clearStation(selected)}>♲ CLEAR CONE</button><p>{message}</p><div className="current-mix">SELECTED CONE {selected + 1} · {Object.values(stations[selected].recipe).reduce((sum, count) => sum + count, 0) ? Object.entries(stations[selected].recipe).filter(([, count]) => count).map(([item, count]) => `${count} ${ingredientName[item as Ingredient]}`).join(' · ') : 'empty'}</div></footer>
  </main>
}
