import { Link } from 'wouter'
import { useEffect, useState } from 'react'
import type { Language } from '../../lib/i18n'

type IntroText = {
  language: string
  kicker: string
  titleTop: string
  titleAccent: string
  intro: string
  register: string
  iceCream: string
  updates: string
  details: string
  tutorialTitle: string
  tutorialButton: string
  tutorialSteps: string[]
  feedbackTitle: string
  feedbackButton: string
  feedbackPrompt: string
  feedbackThanks: string
  feedbackPlaceholder: string
  feedbackSubmit: string
  feedbackClose: string
}

const introText = {
  en: {
    language: 'Language',
    kicker: 'A divided-attention challenge',
    titleTop: 'Morning',
    titleAccent: 'Rush',
    intro: 'Read the tickets. Build each drink. Watch every cup-serve at the perfect moment before it spills. In this cafe, even the machines can dream of ice cream.',
    register: 'Register / sign in',
    iceCream: 'Open the ice cream bar',
    updates: 'Latest updates',
    details: '15 orders · 2 minutes · 3 machines',
    tutorialTitle: 'Quick tutorial',
    tutorialButton: 'How to play',
    tutorialSteps: [
      'Read the ticket and match the order.',
      'Pick the right ingredients and keep the machine ready.',
      'Serve before the cup spills and stay calm under pressure.',
    ],
    feedbackTitle: 'Rate the game',
    feedbackButton: 'Send feedback',
    feedbackPrompt: 'How was your rush today?',
    feedbackThanks: 'Thanks! Your rating was saved.',
    feedbackPlaceholder: 'Tell us what felt great or what should improve.',
    feedbackSubmit: 'Save feedback',
    feedbackClose: 'Close',
  },
  kk: {
    language: 'Тіл',
    kicker: 'Назарды бөлуге арналған ойын',
    titleTop: 'Таңғы',
    titleAccent: 'Қарбалас',
    intro: 'Тапсырыстарды оқы. Әр сусынды дайында. Әр стақанды бақылап, төгілмей тұрып дәл уақытында ұсын. Бұл кафеде тіпті машиналар да балмұздақ туралы армандайды.',
    register: 'Тіркелу / кіру',
    iceCream: 'Балмұздақ барын ашу',
    updates: 'Соңғы жаңартулар',
    details: '15 тапсырыс · 2 минут · 3 машина',
    tutorialTitle: 'Жылдам нұсқаулық',
    tutorialButton: 'Қалай ойнау керек',
    tutorialSteps: [
      'Тапсырысты оқып, дұрыс реттілікпен жаса.',
      'Қажетті ингредиенттерді таңдап, машинаны дайын күйде сақта.',
      'Шыны төгілмей тұрып қызмет көрсетіп, қысымда тыныш қал.',
    ],
    feedbackTitle: 'Ойынды бағалау',
    feedbackButton: 'Пікір жіберу',
    feedbackPrompt: 'Бүгінгі кикілжің қалай өтті?',
    feedbackThanks: 'Рақмет! Бағаңыз сақталды.',
    feedbackPlaceholder: 'Не жақсы жүрді, не жақсарту керек екенін жазыңыз.',
    feedbackSubmit: 'Пікірді сақтау',
    feedbackClose: 'Жабу',
  },
  ru: {
    language: 'Язык',
    kicker: 'Игра на разделение внимания',
    titleTop: 'Утренний',
    titleAccent: 'Ажотаж',
    intro: 'Читай заказы. Готовь каждый напиток. Следи за каждым стаканом и подавай точно вовремя, пока он не пролился. В этом кафе даже машины мечтают о мороженом.',
    register: 'Регистрация / вход',
    iceCream: 'Открыть бар мороженого',
    updates: 'Последние обновления',
    details: '15 заказов · 2 минуты · 3 машины',
    tutorialTitle: 'Короткая инструкция',
    tutorialButton: 'Как играть',
    tutorialSteps: [
      'Прочитай заказ и собери его без ошибок.',
      'Выбирай нужные ингредиенты и держи станцию готовой.',
      'Подавай стакан до того, как он разольётся, и не теряй темп.',
    ],
    feedbackTitle: 'Оцените игру',
    feedbackButton: 'Оставить отзыв',
    feedbackPrompt: 'Как прошёл ваш утренний rush?',
    feedbackThanks: 'Спасибо! Ваша оценка сохранена.',
    feedbackPlaceholder: 'Напишите, что понравилось или что стоит улучшить.',
    feedbackSubmit: 'Сохранить отзыв',
    feedbackClose: 'Закрыть',
  },
} satisfies Record<Language, IntroText>

type Props = {
  language: Language
  onLanguageChange: (language: Language) => void
}

export function CoffeeIntro({ language, onLanguageChange }: Props) {
  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [saved, setSaved] = useState(false)
  const text = introText[language]

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('coffee-rush-rating')
      if (stored) {
        const parsed = JSON.parse(stored) as { rating?: number, comment?: string }
        if (typeof parsed.rating === 'number') {
          setRating(parsed.rating)
        }
        if (typeof parsed.comment === 'string') {
          setComment(parsed.comment)
        }
      }
    } catch {
      // Ignore storage issues and keep the UI usable.
    }
  }, [])

  const saveRating = () => {
    const payload = { rating, comment }
    window.localStorage.setItem('coffee-rush-rating', JSON.stringify(payload))
    setSaved(true)
    setRatingOpen(false)
  }

  return <main className="coffee-intro">
    <div className="sun-disc" />
    <section className="intro-copy">
      <label className="intro-language">
        <span>{text.language}</span>
        <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)}>
          <option value="en">English</option>
          <option value="kk">Қазақша</option>
          <option value="ru">Русский</option>
        </select>
      </label>
      <p className="coffee-kicker">{text.kicker}</p>
      <h1>{text.titleTop}<br/><em>{text.titleAccent}</em></h1>
      <p>{text.intro}</p>
      <div className="intro-actions">
        <Link href="/register" className="intro-link">{text.register} <span>→</span></Link>
        <Link href="/ice-cream" className="intro-link">{text.iceCream} <span>→</span></Link>
        <Link href="/updates" className="intro-link">{text.updates} <span>→</span></Link>
      </div>

      <div className="intro-panels">
        <article className="info-card tutorial-card">
          <p className="card-label">{text.tutorialTitle}</p>
          <ul>
            {text.tutorialSteps.map((step) => <li key={step}>{step}</li>)}
          </ul>
          <button type="button" className="mini-button" onClick={() => setTutorialOpen(true)}>{text.tutorialButton}</button>
        </article>

        <article className="info-card feedback-card">
          <p className="card-label">{text.feedbackTitle}</p>
          <p className="card-copy">{text.feedbackPrompt}</p>
          <div className="mini-stars" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={value <= (rating ?? 0) ? 'star active' : 'star'}
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} out of 5`}
              >
                ★
              </button>
            ))}
          </div>
          <button type="button" className="mini-button" onClick={() => setRatingOpen(true)}>{text.feedbackButton}</button>
          {saved && <p className="saved-note">{text.feedbackThanks}</p>}
        </article>
      </div>

      <small>{text.details}</small>
    </section>
    <div className="intro-cup"><i /><i /><span /></div>

    {tutorialOpen && (
      <div className="overlay" onClick={() => setTutorialOpen(false)}>
        <div className="dialog" onClick={(event) => event.stopPropagation()}>
          <h2>{text.tutorialTitle}</h2>
          <ol>
            {text.tutorialSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <button type="button" className="mini-button" onClick={() => setTutorialOpen(false)}>{text.feedbackClose}</button>
        </div>
      </div>
    )}

    {ratingOpen && (
      <div className="overlay" onClick={() => setRatingOpen(false)}>
        <div className="dialog feedback-dialog" onClick={(event) => event.stopPropagation()}>
          <h2>{text.feedbackTitle}</h2>
          <p>{text.feedbackPrompt}</p>
          <div className="mini-stars large-stars" aria-label="Rating selection">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={value <= (rating ?? 0) ? 'star active' : 'star'}
                onClick={() => setRating(value)}
                aria-label={`Rate ${value} out of 5`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={text.feedbackPlaceholder}
            rows={4}
          />
          <div className="dialog-actions">
            <button type="button" className="mini-button" onClick={saveRating}>{text.feedbackSubmit}</button>
            <button type="button" className="secondary-button" onClick={() => setRatingOpen(false)}>{text.feedbackClose}</button>
          </div>
        </div>
      </div>
    )}
  </main>
}
