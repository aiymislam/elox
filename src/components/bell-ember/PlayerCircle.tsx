import type { Player } from '../../lib/bellEmber'

type Props = { players: Player[]; selectedId: string | null; onSelect: (id: string) => void }

export function PlayerCircle({ players, selectedId, onSelect }: Props) {
  return <div className="player-circle">
    <div className="circle-center"><span>✦</span><small>Choose wisely</small></div>
    {players.map((player, index) => {
      const angle = (index / players.length) * Math.PI * 2 - Math.PI / 2
      const style = { '--x': `${50 + Math.cos(angle) * 40}%`, '--y': `${50 + Math.sin(angle) * 40}%` } as React.CSSProperties
      return <button key={player.id} style={style} className={`${selectedId === player.id ? 'selected' : ''} ${!player.alive ? 'dead' : ''}`} onClick={() => player.alive && onSelect(player.id)}>
        <span className="avatar">{player.name.charAt(0).toUpperCase()}</span><b>{player.name}</b><small>{player.alive ? 'Alive' : 'Fallen'}</small>
      </button>
    })}
  </div>
}
