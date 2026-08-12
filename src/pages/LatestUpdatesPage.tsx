import { Link } from 'wouter'

const updates = [
  'MAKE now switches between ice cream and coffee.',
  'Ice cream mode has its own cup look with scoops.',
  'Vercel build was fixed with the 3D library dependency.',
]

export function LatestUpdatesPage() {
  return <main className="updates-screen">
    <section className="updates-panel">
      <p className="coffee-kicker">Latest updates</p>
      <h1>What changed</h1>
      <ul>
        {updates.map((update) => <li key={update}>{update}</li>)}
      </ul>
      <Link className="back-button" href="/">Back to menu</Link>
    </section>
  </main>
}
