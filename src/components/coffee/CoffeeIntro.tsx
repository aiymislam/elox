import { Link } from 'wouter'

export function CoffeeIntro() {
  return <main className="coffee-intro">
    <div className="sun-disc" />
    <section className="intro-copy">
      <p className="coffee-kicker">A divided-attention challenge</p>
      <h1>Morning<br/><em>Rush</em></h1>
      <p>Read the tickets. Build each drink. Watch every cup—serve at the perfect moment before it spills. In this café, even the machines can dream of ice cream.</p>
      <div className="intro-actions">
        <Link href="/register" className="intro-link">Register / sign in <span>→</span></Link>
        <Link href="/ice-cream" className="intro-link">Open the ice cream bar <span>→</span></Link>
        <Link href="/updates" className="intro-link">Latest updates <span>→</span></Link>
      </div>
      <small>15 orders · 2 minutes · 3 machines</small>
    </section>
    <div className="intro-cup"><i /><i /><span /></div>
  </main>
}
