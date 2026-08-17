import { Link } from 'wouter'
import { useState } from 'react'
import type { Ingredient } from '../../lib/coffeeGame'
import { ingredientIcon, ingredientName } from '../../lib/coffeeGame'

type Props = { onBack: () => void }
type Scoop = { id: number; flavor: Ingredient }

const flavors: Ingredient[] = ['vanilla', 'strawberry', 'chocolate']

export function IceCreamScreen({ onBack }: Props) {
  const [scoops, setScoops] = useState<Scoop[]>([])
  const [flyingScoop, setFlyingScoop] = useState<Scoop | null>(null)

  const scoopFlavor = (flavor: Ingredient) => {
    const nextScoop = { id: Date.now(), flavor }
    setFlyingScoop(nextScoop)
    window.setTimeout(() => {
      setScoops((current) => [...current.slice(-3), nextScoop])
      setFlyingScoop(null)
    }, 620)
  }

  return <main className="ice-cream-screen">
    <Link className="back-button" href="/" onClick={onBack}>← Back to menu</Link>
    <section className="ice-cream-panel">
      <p className="coffee-kicker">Sweet stop</p>
      <h1>Ice Cream<br /><em>Bar</em></h1>
      <p>Choose a scoop, add your favorite toppings, and take a chilled break from the rush.</p>
      <div className="scoop-stage">
        <div className="scoop-tubs">
          {flavors.map((flavor) => <button className={`scoop-tub ${flavor}`} key={flavor} onClick={() => scoopFlavor(flavor)}>
            <i>{ingredientIcon[flavor]}</i>
            <span>{ingredientName[flavor]}</span>
          </button>)}
        </div>
        <div className="scoop-display">
          {flyingScoop && <i className={`flying-scoop ${flyingScoop.flavor}`} />}
          <div className="ice-cream-cone menu-cone">
            <div className={`ice-cream-scoop scoop-count-${scoops.length}`}>
              {scoops.map((scoop) => <i className={scoop.flavor} key={scoop.id} />)}
            </div>
          </div>
        </div>
      </div>
      <div className="flavor-grid">
        <article className="flavor-card">
          <h3>🍦 Vanilla swirl</h3>
          <p>Soft, creamy, and perfect for a calm moment.</p>
        </article>
        <article className="flavor-card">
          <h3>🍓 Strawberry cloud</h3>
          <p>Bright berries with a playful, light finish.</p>
        </article>
        <article className="flavor-card">
          <h3>🍫 Chocolate dream</h3>
          <p>Rich and cozy, made for a little indulgence.</p>
        </article>
      </div>
      <Link className="menu-primary" href="/" onClick={onBack}>Take a scoop</Link>
    </section>
  </main>
}
