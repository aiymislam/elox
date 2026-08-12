import { checkWinner, livingPlayers } from '../../lib/bellEmber'
import type { GameState } from '../../lib/bellEmber'
import { PlayerCircle } from './PlayerCircle'

type Props = { game: GameState; onChange: (game: GameState) => void; onNewGame: () => void }

export function GameBoard({ game, onChange, onNewGame }: Props) {
  const alive = livingPlayers(game)
  const selected = game.players.find((player) => player.id === game.selectedId)
  const nominee = game.players.find((player) => player.id === game.nomineeId)

  const updatePlayers = (id: string) => game.players.map((player) => player.id === id ? { ...player, alive: false } : player)
  const resolveElimination = (id: string, message: string) => {
    const players = updatePlayers(id)
    const winner = checkWinner(players)
    const afterNight = game.phase === 'night'
    onChange({ ...game, players, winner, phase: winner ? 'ended' : afterNight ? 'day' : 'night', day: afterNight ? game.day + 1 : game.day, selectedId: null, nomineeId: null, votes: 0, log: [message, ...game.log] })
  }
  const resolveNight = () => {
    if (!selected) return
    resolveElimination(selected.id, `${selected.name} did not wake when the morning bell rang.`)
  }
  const startVote = () => selected && onChange({ ...game, nomineeId: selected.id, selectedId: null, votes: 0 })
  const castVote = () => onChange({ ...game, votes: Math.min(game.votes + 1, alive.length) })
  const resolveVote = () => {
    if (!nominee) return
    const majority = Math.floor(alive.length / 2) + 1
    if (game.votes >= majority) resolveElimination(nominee.id, `${nominee.name} was sent beyond the village gates with ${game.votes} votes.`)
    else onChange({ ...game, nomineeId: null, votes: 0, log: [`${nominee.name} survived the vote.`, ...game.log] })
  }
  const beginDay = () => onChange({ ...game, phase: 'day', day: game.day + 1, selectedId: null, log: [`Dawn ${game.day + 1} breaks over Ember Hollow.`, ...game.log] })

  if (game.phase === 'ended') return <main className={`ending-page ${game.winner}`}><section>
    <p className="eyebrow">The final bell has rung</p><div className="ending-mark">{game.winner === 'village' ? '☀' : '☾'}</div>
    <h1>{game.winner === 'village' ? 'The Village Endures' : 'The Shadow Prevails'}</h1>
    <p>{game.winner === 'village' ? 'The Hollow has been uncovered. Light returns to every window.' : 'The village has lost its voice. Darkness settles over the hollow.'}</p>
    <button className="primary-button" onClick={onNewGame}>Play another tale</button>
  </section></main>

  return <main className={`board-page ${game.phase}`}>
    <header><div><p className="eyebrow">Ember Hollow · {game.phase === 'night' ? `Night ${game.day + 1}` : `Day ${game.day}`}</p><h1>{game.phase === 'night' ? 'The village sleeps' : 'The bell calls council'}</h1></div><div className="alive-count"><b>{alive.length}</b><span>still alive</span></div></header>
    <section className="board-layout">
      <div className="play-panel">
        <PlayerCircle players={game.players} selectedId={game.selectedId} onSelect={(selectedId) => onChange({ ...game, selectedId })} />
        <div className="action-card">
          {game.phase === 'night' ? <><p className="eyebrow">Storyteller · Night {game.day + 1}</p><h2>Who vanishes before dawn?</h2><p>Select the Hollow’s target. Other roles may perform their secret actions now.</p><button className="primary-button" disabled={!selected} onClick={resolveNight}>Confirm nightfall</button><button className="quiet-button" onClick={beginDay}>No one dies tonight</button></> : nominee ? <><p className="eyebrow">Council vote</p><h2>{nominee.name} is nominated</h2><p>Raise hands together, then record the total.</p><div className="vote-counter"><button onClick={() => onChange({ ...game, votes: Math.max(0, game.votes - 1) })}>−</button><b>{game.votes}</b><button onClick={castVote}>+</button></div><button className="primary-button" onClick={resolveVote}>Resolve vote</button></> : <><p className="eyebrow">Open discussion</p><h2>Nominate a suspect</h2><p>Listen closely. Select one living player when the village is ready.</p><button className="primary-button" disabled={!selected} onClick={startVote}>Nominate {selected?.name ?? 'a player'}</button><button className="quiet-button" onClick={() => onChange({ ...game, phase: 'night', log: ['The council chose silence. Night returns.', ...game.log] })}>End day without execution</button></>}
        </div>
      </div>
      <aside><h3>Village record</h3>{game.log.slice(0, 5).map((entry, index) => <p key={`${entry}-${index}`}><span>{index === 0 ? 'Now' : 'Then'}</span>{entry}</p>)}<button onClick={onNewGame}>Leave this tale</button></aside>
    </section>
  </main>
}
