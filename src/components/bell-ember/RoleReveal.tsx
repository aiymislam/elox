import { useState } from 'react'
import type { GameState } from '../../lib/bellEmber'

type Props = { game: GameState; onChange: (game: GameState) => void }

export function RoleReveal({ game, onChange }: Props) {
  const [visible, setVisible] = useState(false)
  const player = game.players[game.revealIndex]
  const isLast = game.revealIndex === game.players.length - 1

  const advance = () => {
    setVisible(false)
    onChange({ ...game, revealIndex: isLast ? game.revealIndex : game.revealIndex + 1, phase: isLast ? 'night' : 'reveal' })
  }

  return (
    <main className={`reveal-page ${player.role.team}`}>
      <section className="reveal-card">
        <p className="turn-count">Player {game.revealIndex + 1} of {game.players.length}</p>
        {!visible ? <>
          <div className="sealed-role"><span>✦</span></div>
          <h2>Pass to {player.name}</h2>
          <p>Make sure nobody else can see the screen.</p>
          <button className="primary-button" onClick={() => setVisible(true)}>Reveal my role</button>
        </> : <>
          <p className="eyebrow">Your secret role</p>
          <div className="role-glyph">{player.role.icon}</div>
          <h1>{player.role.name}</h1>
          <span className="team-pill">{player.role.team === 'village' ? 'Village' : 'Shadow'}</span>
          <p className="ability">{player.role.ability}</p>
          <div className="night-note"><b>First night</b><p>{player.role.firstNight}</p></div>
          <button className="primary-button" onClick={advance}>{isLast ? 'Begin the first night' : 'Hide & pass on'} <span>→</span></button>
        </>}
      </section>
    </main>
  )
}
