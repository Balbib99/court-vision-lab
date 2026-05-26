import { Plus, Users } from 'lucide-react'
import type { RosterPlayer } from '../../data/roster'

type RosterViewProps = {
  players: RosterPlayer[]
  onAddPlayer: () => void
  onLoadRosterToCourt: () => void
}

const primaryStats: Array<keyof Pick<RosterPlayer, 'shooting' | 'threePoint' | 'passing' | 'defense'>> = [
  'shooting',
  'threePoint',
  'passing',
  'defense',
]

function PlayerCard({ player }: { player: RosterPlayer }) {
  return (
    <article className="panel-floating rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="accent-bg-soft tactical-border-strong flex h-12 w-12 shrink-0 items-center justify-center rounded-md border font-mono text-lg font-black text-[var(--accent)]">
            {player.number}
          </div>
          <div>
            <h3 className="text-main text-lg font-black">{player.name}</h3>
            <p className="text-muted mt-1 text-sm">{player.position} - {player.role}</p>
            <p className="text-soft mt-1 font-mono text-[10px] uppercase tracking-[0.1em]">{player.height} - {player.weight}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-soft font-mono text-[10px] uppercase">Rating</p>
          <p className="accent-text font-mono text-xl font-black">{player.rating}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {primaryStats.map((stat) => (
          <div key={stat} className="panel rounded-md border p-2">
            <div className="flex justify-between font-mono text-[10px] uppercase text-[var(--text-soft)]">
              <span>{stat === 'threePoint' ? '3PT' : stat}</span>
              <span>{player[stat]}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${player[stat]}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {player.tags.map((tag) => (
          <span key={tag} className="accent-badge rounded-sm px-2 py-1 font-mono text-[10px] font-bold uppercase">
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}

export function RosterView({ players, onAddPlayer, onLoadRosterToCourt }: RosterViewProps) {
  const activePlayers = players.filter((player) => player.status === 'active')
  const benchPlayers = players.filter((player) => player.status === 'bench')

  return (
    <section className="min-h-full p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="accent-text font-mono text-xs font-bold uppercase tracking-[0.16em]">Roster</p>
            <h2 className="text-main mt-2 font-display text-3xl tracking-[0.05em]">Roster Management</h2>
            <p className="text-muted mt-2 text-sm">Manage the demo squad and load the active unit onto the tactical board.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onAddPlayer} className="panel inline-flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-bold text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)]" aria-label="Add player coming soon" title="Add player coming soon">
              <Plus size={17} aria-hidden="true" />
              Add Player
            </button>
            <button type="button" onClick={onLoadRosterToCourt} className="accent-badge rounded-md px-4 py-3 text-sm font-bold" aria-label="Load demo roster to court" title="Load demo roster to court" data-guide="load-roster-button">
              Load Demo Roster to Court
            </button>
          </div>
        </div>
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="panel-floating rounded-xl border p-4">
            <p className="text-soft font-mono text-[10px] uppercase tracking-[0.12em]">Active Roster</p>
            <p className="text-main mt-2 text-2xl font-black">{activePlayers.length} / {players.length}</p>
          </div>
          <div className="panel-floating rounded-xl border p-4">
            <p className="text-soft font-mono text-[10px] uppercase tracking-[0.12em]">Bench</p>
            <p className="text-main mt-2 text-2xl font-black">{benchPlayers.length}</p>
          </div>
          <div className="panel-floating rounded-xl border p-4">
            <p className="text-soft font-mono text-[10px] uppercase tracking-[0.12em]">Average Rating</p>
            <p className="accent-text mt-2 text-2xl font-black">{Math.round(players.reduce((total, player) => total + player.rating, 0) / players.length)}</p>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Users size={17} className="text-[var(--accent)]" aria-hidden="true" />
              <h3 className="text-soft font-mono text-[11px] font-bold uppercase tracking-[0.16em]">Active Roster</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {activePlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>
          </section>
          <section>
            <h3 className="text-soft mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em]">Bench / Available Players</h3>
            <div className="grid gap-4">
              {benchPlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
