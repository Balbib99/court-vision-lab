import { Plus, Users } from 'lucide-react'
import type { RosterPlayer } from '../../data/roster'
import { MiniCourt } from '../shared/MiniCourt'
import { StatTicks } from '../shared/StatTicks'

const POSITION_ORDER = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F']

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
    <article className="chrome-surface rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="chrome-btn flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[color:var(--border)] font-mono text-lg font-black text-[var(--text-main)]">
            {player.number}
          </div>
          <div>
            <h3 className="text-main text-lg font-black">{player.name}</h3>
            <p className="text-muted mt-1 text-sm">{player.position} - {player.role}</p>
            <p className="text-muted mt-1 text-[11px]">{player.height} - {player.weight}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-muted text-[10px]">Rating</p>
          <p className="text-main font-mono text-xl font-black tabular-nums">{player.rating}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {primaryStats.map((stat) => (
          <div key={stat} className="border border-[color:var(--border)] rounded-md p-2">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span>{stat === 'threePoint' ? '3PT' : stat}</span>
              <span className="font-mono font-bold text-[var(--text-main)] tabular-nums">{player[stat]}</span>
            </div>
            <StatTicks value={player[stat]} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {player.tags.map((tag) => (
          <span key={tag} className="chrome-surface rounded-sm border px-2 py-1 text-[10px] font-bold text-[var(--text-muted)]">
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
  const bestStarter = [...activePlayers].sort((a, b) => b.rating - a.rating)[0]
  const positionCounts = POSITION_ORDER
    .map((position) => ({ position, count: players.filter((player) => player.position === position).length }))
    .filter((entry) => entry.count > 0)

  return (
    <section className="min-h-full p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-main font-display text-3xl">Roster management</h2>
            <p className="text-muted mt-2 text-sm">Manage the demo squad and load the active unit onto the tactical board.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onAddPlayer} className="chrome-surface chrome-btn inline-flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-bold" aria-label="Add player coming soon" title="Add player coming soon">
              <Plus size={17} strokeWidth={1.75} aria-hidden="true" />
              Add player
            </button>
            <button type="button" onClick={onLoadRosterToCourt} className="chrome-btn-primary rounded-md px-4 py-3 text-sm font-bold" aria-label="Load demo roster to court" title="Load demo roster to court" data-guide="load-roster-button">
              Load demo roster to court
            </button>
          </div>
        </div>
        <div className="mb-5 grid gap-4 md:grid-cols-3">
          <div className="chrome-surface rounded-xl border p-4">
            <p className="text-soft text-[11px] font-semibold">Active roster</p>
            <p className="text-main mt-2 font-mono text-2xl font-black tabular-nums">{activePlayers.length} / {players.length}</p>
          </div>
          <div className="chrome-surface rounded-xl border p-4">
            <p className="text-soft text-[11px] font-semibold">Bench</p>
            <p className="text-main mt-2 font-mono text-2xl font-black tabular-nums">{benchPlayers.length}</p>
          </div>
          <div className="chrome-surface rounded-xl border p-4">
            <p className="text-soft text-[11px] font-semibold">Average rating</p>
            <p className="text-main mt-2 font-mono text-2xl font-black tabular-nums">{Math.round(players.reduce((total, player) => total + player.rating, 0) / players.length)}</p>
          </div>
        </div>
        <div className="mb-6 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
          <article className="chrome-surface rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-soft text-[11px] font-semibold">Starting five</p>
                <p className="text-muted mt-1 text-xs">The active unit as it lands on the board - dot size tracks rating.</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-main text-sm font-bold">{bestStarter?.name}</p>
                <p className="text-soft text-[11px]">{bestStarter?.position} · {bestStarter?.rating} rating</p>
              </div>
            </div>
            <div className="mx-auto mt-3 h-64 max-w-[280px]">
              <MiniCourt
                players={activePlayers.map((player) => ({
                  id: player.id,
                  label: String(player.number),
                  position: player.position,
                  value: player.rating,
                  emphasized: player.id === bestStarter?.id,
                }))}
              />
            </div>
          </article>
          <article className="chrome-surface rounded-xl border p-4">
            <p className="text-soft text-[11px] font-semibold">Roster composition</p>
            <div className="mt-4 grid gap-2.5">
              {positionCounts.map(({ position, count }) => (
                <div key={position} className="flex items-center justify-between gap-3">
                  <span className="text-muted text-sm">{position}</span>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: count }).map((_, index) => (
                      <span key={index} className="h-2.5 w-2.5 rounded-full bg-[var(--text-main)]" aria-hidden="true" />
                    ))}
                    <span className="text-main ml-1 w-4 text-right font-mono text-xs font-bold tabular-nums">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Users size={16} strokeWidth={1.75} className="text-[var(--text-soft)]" aria-hidden="true" />
              <h3 className="text-soft text-[11px] font-bold">Active roster</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {activePlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>
          </section>
          <section>
            <h3 className="text-soft mb-3 text-[11px] font-bold">Bench / available players</h3>
            <div className="grid gap-4">
              {benchPlayers.map((player) => <PlayerCard key={player.id} player={player} />)}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}
