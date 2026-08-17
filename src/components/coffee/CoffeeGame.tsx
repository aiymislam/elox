import type { DragEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { BREW_TIME, GAME_SECONDS, TARGET_ORDERS, fillLevel, ingredientIcon, ingredientName, makeOrder, makeStation, sameRecipe } from '../../lib/coffeeGame'
import type { Ingredient, Order, Station } from '../../lib/coffeeGame'
import type { Language } from '../../lib/i18n'
import { BrewStation } from './BrewStation'
import { OrderTicket } from './OrderTicket'

type ProductMode = 'coffee' | 'iceCream'

type Props = {
  onExit: () => void
  language: Language
  onLanguageChange: (language: Language) => void
}

type TutorialStep = {
  title: string
  text: string
  action: 'ticket' | 'mix' | 'serve'
}

const gameText = {
  en: {
    menu: 'MENU',
    score: 'SCORE',
    time: 'TIME',
    language: 'Language',
    defaultMessage: 'Build an order, then start the brewer.',
    startBrew: 'Ice cream is mixing—watch the cone!',
    noMatch: 'No ticket matches that drink. Check the recipe.',
    perfect: 'Perfect timing!',
    early: 'A little early.',
    iceCreamMode: 'Ice cream mode is on.',
    coffeeMode: 'Coffee mode is on.',
    shiftComplete: 'Shift complete',
    brilliant: 'Brilliant service!',
    closing: 'Closing time',
    scoreLabel: 'Score',
    playAgain: 'Play again',
    backToMenu: 'Back to menu',
    ordersServed: 'orders served',
    clearCone: 'CLEAR CONE',
    selected: 'SELECTED CONE',
    empty: 'empty',
    orderGoal: 'orders served',
    perfectShort: 'Perfect timing! +',
    earlyShort: 'A little early. +',
    title: 'MORNING',
    accent: 'RUSH',
    tutorial: 'Tutorial',
    tutorialNext: 'Next',
    tutorialSkip: 'Skip',
    tutorialDoneTitle: 'Yay, you did it!',
    tutorialDoneText: 'Now keep serving orders on your own.',
    hintOneTitle: 'Read your ticket',
    hintOneText: 'Match the order colors to the ingredients on the left.',
    hintTwoTitle: 'Build the mix',
    hintTwoText: 'Tap or drag the ingredients into the selected machine.',
    hintThreeTitle: 'Serve on time',
    hintThreeText: 'Press Serve when the cup is full and the timing feels right.',
  },
  kk: {
    menu: 'МЕНЮ',
    score: 'ҰПАЙ',
    time: 'УАҚЫТ',
    language: 'Тіл',
    defaultMessage: 'Тапсырыс құрып, содан кейін brewer-ді іске қос.',
    startBrew: 'Балмұздақ араласуда—конусты бақыла!',
    noMatch: 'Бұл сусын ешбір тапсырыспен сәйкес емес. Рецептін тексер.',
    perfect: 'Керемет уақыт!',
    early: 'Біршама ерте.',
    iceCreamMode: 'Балмұздақ режимі қосылды.',
    coffeeMode: 'Кофе режимі қосылды.',
    shiftComplete: 'Смена бітті',
    brilliant: 'Тамаша қызмет!',
    closing: 'Жабылу уақыты',
    scoreLabel: 'Ұпай',
    playAgain: 'Қайта ойнау',
    backToMenu: 'Меңюшеге қайту',
    ordersServed: 'тапсырыс берілді',
    clearCone: 'КОНУСЫ ТАЗАЛАУ',
    selected: 'ТАңДАЛҒАН КОНУС',
    empty: 'бос',
    orderGoal: 'тапсырыс берілді',
    perfectShort: 'Керемет уақыт! +',
    earlyShort: 'Біршама ерте. +',
    title: 'ТАҢҒЫ',
    accent: 'ҚАРБАЛАС',
    tutorial: 'Нұсқаулық',
    tutorialNext: 'Келесі',
    tutorialSkip: 'Өткізу',
    tutorialDoneTitle: 'Ура, сен жасадың!',
    tutorialDoneText: 'Енді тапсырыстарды өзің жалғастыр.',
    hintOneTitle: 'Тапсырысты оқы',
    hintOneText: 'Түс пен ингредиенттерді тапсырыс бойынша сәйкестендір.',
    hintTwoTitle: 'Қоспаны жаса',
    hintTwoText: 'Таңдалған машинаның үстіне ингредиенттерді басу арқылы қос.',
    hintThreeTitle: 'Уақытында бер',
    hintThreeText: 'Шыны толып, уақыт дұрыс болса “Serve” батырмасын бас.',
  },
  ru: {
    menu: 'МЕНЮ',
    score: 'СЧЁТ',
    time: 'ВРЕМЯ',
    language: 'Язык',
    defaultMessage: 'Собери заказ, затем запусти аппарат.',
    startBrew: 'Мороженое смешивается—следи за рожком!',
    noMatch: 'Нет заказа, подходящего под этот напиток. Проверь рецепт.',
    perfect: 'Идеальная подача!',
    early: 'Чуть раньше.',
    iceCreamMode: 'Включён режим мороженого.',
    coffeeMode: 'Включён режим кофе.',
    shiftComplete: 'Смена завершена',
    brilliant: 'Отличное обслуживание!',
    closing: 'Время закрытия',
    scoreLabel: 'Счёт',
    playAgain: 'Играть снова',
    backToMenu: 'Назад в меню',
    ordersServed: 'заказов подано',
    clearCone: 'ОЧИСТИТЬ КОНУС',
    selected: 'ВЫБРАН КОНУС',
    empty: 'пусто',
    orderGoal: 'заказов подано',
    perfectShort: 'Идеально! +',
    earlyShort: 'Чуть рано. +',
    title: 'УТРЕННИЙ',
    accent: 'АЖОТАЖ',
    tutorial: 'Обучение',
    tutorialNext: 'Дальше',
    tutorialSkip: 'Пропустить',
    tutorialDoneTitle: 'Ура, получилось!',
    tutorialDoneText: 'Теперь продолжай обслуживать заказы сам.',
    hintOneTitle: 'Прочитай заказ',
    hintOneText: 'Сравни цвета в заказе с ингредиентами слева.',
    hintTwoTitle: 'Собери смесь',
    hintTwoText: 'Нажимай или перетаскивай ингредиенты в выбранную машину.',
    hintThreeTitle: 'Подавай вовремя',
    hintThreeText: 'Нажми Serve, когда стакан готов и момент подходит.',
  },
} satisfies Record<Language, Record<string, string>>

export function CoffeeGame({ onExit, language, onLanguageChange }: Props) {
  const [orders, setOrders] = useState<Order[]>(() => [makeOrder(), makeOrder(), makeOrder()])
  const [stations, setStations] = useState<Station[]>(() => [makeStation(), makeStation(), makeStation()])
  const [selected, setSelected] = useState(0)
  const [score, setScore] = useState(0)
  const [served, setServed] = useState(0)
  const [productMode, setProductMode] = useState<ProductMode>('coffee')
  const [now, setNow] = useState(Date.now())
  const [endAt] = useState(() => Date.now() + GAME_SECONDS * 1000)
  const [tutorialStep, setTutorialStep] = useState(0)
  const [tutorialVisible, setTutorialVisible] = useState(true)
  const [tutorialDone, setTutorialDone] = useState(false)
  const text = gameText[language]
  const [message, setMessage] = useState(text.defaultMessage)
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
    setMessage(text.startBrew)
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
    setProductMode('iceCream')
    const station = stations[index]
    const order = orders.find((item) => sameRecipe(item, station.recipe))
    if (!order) { setMessage(text.noMatch); return }
    startBrew(index, station, order)
  }
  const serve = (index: number) => {
    const station = stations[index]
    const level = fillLevel(station, now)
    if (station.status !== 'brewing') return
    const points = Math.max(250, Math.round(1000 - Math.abs(1 - level) * 2400))
    setScore((current) => current + points); setServed((current) => current + 1)
    setMessage(level >= .82 ? `${text.perfectShort}${points}` : `${text.earlyShort}${points}`); clearStation(index)
  }
  const toggleProductMode = () => {
    const nextMode = productMode === 'coffee' ? 'iceCream' : 'coffee'
    setProductMode(nextMode)
    setMessage(nextMode === 'iceCream' ? text.iceCreamMode : text.coffeeMode)
  }
  const progress = useMemo(() => Math.min(100, served / TARGET_ORDERS * 100), [served])
  const tutorialSteps: TutorialStep[] = [
    { title: text.hintOneTitle, text: text.hintOneText, action: 'ticket' },
    { title: text.hintTwoTitle, text: text.hintTwoText, action: 'mix' },
    { title: text.hintThreeTitle, text: text.hintThreeText, action: 'serve' },
  ]
  const currentTutorial = tutorialSteps[tutorialStep] ?? tutorialSteps[0]
  const tutorialFocus = tutorialVisible && !tutorialDone ? currentTutorial.action : null
  const finishTutorial = () => {
    setTutorialDone(true)
    window.setTimeout(() => setTutorialVisible(false), 1500)
  }

  useEffect(() => {
    if (!tutorialVisible) return
    if (tutorialStep === 2 && served > 0) {
      finishTutorial()
      return
    }
    if (tutorialStep === 0 && served > 0) setTutorialStep(1)
    if (tutorialStep === 1 && stations.some((station) => station.status === 'brewing')) setTutorialStep(2)
  }, [served, stations, tutorialStep, tutorialVisible])

  if (finished) return <main className="coffee-result"><section><p>{text.shiftComplete}</p><h1>{served >= TARGET_ORDERS ? text.brilliant : text.closing}</h1><div className="final-score"><span>{text.scoreLabel}</span><b>{finalScore.toLocaleString()}</b></div><p>{text.orderGoal.replace('{served}', String(served)).replace('{total}', String(TARGET_ORDERS))}</p><button onClick={() => window.location.reload()}>{text.playAgain}</button><button className="exit-link" onClick={onExit}>{text.backToMenu}</button></section></main>

  return <main className="coffee-game">
    <header>
      <button onClick={onExit}>‹ {text.menu}</button>
      <div className="brand">{text.title} <em>{text.accent}</em></div>
      <div className="game-stats">
        <span>{text.score} <b>{score.toLocaleString()}</b></span>
        <span>{text.time} <b>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</b></span>
      </div>
    </header>
    {tutorialVisible && (
      <div className="game-tutorial" data-step={currentTutorial.action}>
        <div className="tutorial-label">{text.tutorial}</div>
        <h3>{tutorialDone ? text.tutorialDoneTitle : currentTutorial.title}</h3>
        <p>{tutorialDone ? text.tutorialDoneText : currentTutorial.text}</p>
        {!tutorialDone && <div className="tutorial-actions">
          <button type="button" onClick={() => tutorialStep === tutorialSteps.length - 1 ? finishTutorial() : setTutorialStep((current) => current + 1)}>{text.tutorialNext}</button>
          <button type="button" className="tutorial-skip" onClick={() => setTutorialVisible(false)}>{text.tutorialSkip}</button>
        </div>}
      </div>
    )}
    <label className="intro-language" style={{ marginLeft: 'auto', marginBottom: '12px' }}>
      <span>{text.language}</span>
      <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)}>
        <option value="en">English</option>
        <option value="kk">Қазақша</option>
        <option value="ru">Русский</option>
      </select>
    </label>
    <div className="target-bar"><span style={{ width: `${progress}%` }} /><p>{served} / {TARGET_ORDERS} {text.orderGoal}</p></div>
    <section className="cafe-counter">
      <div className={`ticket-rail ${tutorialFocus === 'ticket' ? 'tutorial-highlight' : ''}`}>{orders.map((order, index) => <OrderTicket key={order.id} order={order} number={served + index + 1} />)}</div>
      <button className={`ice-cream-highlight ${productMode === 'iceCream' ? 'active' : ''}`} onClick={toggleProductMode}>
        <p>{productMode === 'iceCream' ? 'Ice cream mode' : 'Coffee mode'}</p>
        <span>🍦 Vanilla · 🍓 Strawberry · 🍫 Chocolate</span>
      </button>
      <div className="shelf"><div className="ingredient-jars">{(['vanilla', 'strawberry', 'chocolate'] as Ingredient[]).map((item) => <button className={tutorialFocus === 'mix' ? 'tutorial-highlight' : ''} key={item} draggable onDragStart={(event) => dragIngredient(event, item)} onClick={() => addIngredient(item)}><i className={item}>{ingredientIcon[item]}</i><b>{ingredientName[item]}</b><small>drag or tap</small></button>)}</div></div>
      <div className="stations">{stations.map((station, index) => <BrewStation key={index} station={station} now={now} index={index} selected={selected === index} tutorialFocus={tutorialFocus === 'mix' || tutorialFocus === 'serve' ? tutorialFocus : null} onSelect={() => setSelected(index)} onMake={() => brew(index)} onServe={() => serve(index)} onTrash={() => clearStation(index)} onDropIngredient={(ingredient) => addIngredient(ingredient, index)} />)}</div>
    </section>
    <footer><button onClick={() => clearStation(selected)}>♲ {text.clearCone}</button><p>{message}</p><div className="current-mix">{text.selected} {selected + 1} · {Object.values(stations[selected].recipe).reduce((sum, count) => sum + count, 0) ? Object.entries(stations[selected].recipe).filter(([, count]) => count).map(([item, count]) => `${count} ${ingredientName[item as Ingredient]}`).join(' · ') : text.empty}</div></footer>
  </main>
}
