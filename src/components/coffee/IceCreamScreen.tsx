import { Link } from 'wouter'

type Props = { onBack: () => void }

export function IceCreamScreen({ onBack }: Props) {
  return <main className="ice-cream-screen">
    <Link className="back-button" href="/" onClick={onBack}>← Back to menu</Link>
    <section className="ice-cream-panel">
      <p className="coffee-kicker">Sweet stop</p>
      <h1>Ice Cream<br /><em>Bar</em></h1>
      <p>Choose a scoop, add your favorite toppings, and take a chilled break from the rush.</p>
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
