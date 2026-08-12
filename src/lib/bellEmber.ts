export type Team = 'village' | 'shadow'
export type Phase = 'reveal' | 'night' | 'day' | 'ended'

export type Role = {
  name: string
  team: Team
  icon: string
  ability: string
  firstNight: string
}

export type Player = {
  id: string
  name: string
  role: Role
  alive: boolean
  voteUsed: boolean
}

export type GameState = {
  players: Player[]
  phase: Phase
  day: number
  revealIndex: number
  nightIndex: number
  selectedId: string | null
  nomineeId: string | null
  votes: number
  log: string[]
  winner: Team | null
}

export const roles: Role[] = [
  { name: 'Lamplighter', team: 'village', icon: '✦', ability: 'Each night, learn whether one living player walks with the Shadow.', firstNight: 'Choose a player. The storyteller shows their true allegiance.' },
  { name: 'Archivist', team: 'village', icon: '⌘', ability: 'On the first night, learn two players—one is the Whisperer.', firstNight: 'Study two names the storyteller gives you. One belongs to the Whisperer.' },
  { name: 'Warden', team: 'village', icon: '♜', ability: 'Once per game, protect a player from the night attack.', firstNight: 'You may quietly point to the player you wish to protect.' },
  { name: 'Herbalist', team: 'village', icon: '❧', ability: 'If your nearest living neighbour dies at night, learn the attacker’s team.', firstNight: 'Notice who sits nearest to you on both sides.' },
  { name: 'Bellkeeper', team: 'village', icon: '♢', ability: 'Your vote counts twice while exactly four players live.', firstNight: 'You sleep soundly. Keep your identity hidden.' },
  { name: 'Whisperer', team: 'shadow', icon: '☾', ability: 'Each night, choose a player to silence. Silenced players cannot nominate tomorrow.', firstNight: 'Open your eyes and recognise the Hollow.' },
  { name: 'Hollow', team: 'shadow', icon: '◉', ability: 'Each night, choose a player to remove. If executed, the Village wins.', firstNight: 'Recognise your Whisperer, then choose your first target.' },
]

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

export function createGame(names: string[]): GameState {
  const chosenRoles = shuffle(roles).slice(0, names.length)
  const players = shuffle(names).map((name, index) => ({
    id: crypto.randomUUID(), name, role: chosenRoles[index], alive: true, voteUsed: false,
  }))
  return { players, phase: 'reveal', day: 0, revealIndex: 0, nightIndex: 0, selectedId: null, nomineeId: null, votes: 0, log: ['The lanterns are lit. The game begins.'], winner: null }
}

export function checkWinner(players: Player[]): Team | null {
  const alive = players.filter((player) => player.alive)
  const shadow = alive.filter((player) => player.role.team === 'shadow')
  if (!alive.some((player) => player.role.name === 'Hollow')) return 'village'
  if (shadow.length >= alive.length - shadow.length) return 'shadow'
  return null
}

export function livingPlayers(game: GameState) {
  return game.players.filter((player) => player.alive)
}
