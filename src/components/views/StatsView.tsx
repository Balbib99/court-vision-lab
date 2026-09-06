import type { RosterPlayer } from '../../data/roster'
import { MiniCourt } from '../shared/MiniCourt'
import { StatTicks } from '../shared/StatTicks'
import { getDefensiveRating, getOffensiveRating, getTeamAverage, rankPlayersByStat, statGroups, type RosterStatKey } from '../../utils/rosterStats'

type StatsViewProps = {
  players: RosterPlayer[]
}

const comparisonMetrics: Array<{ label: string; key: RosterStatKey }> = [
  { label: 'Shooting', key: 'shooting' },
  { label: '3PT', key: 'threePoint' },
  { label: 'Passing', key: 'passing' },
  { label: 'Rebounding', key: 'rebounding' },
  { label: 'Defense', key: 'defense' },
  { label: 'Speed', key: 'speed' },
  { label: 'Finishing', key: 'finishing' },
]

export function StatsView({ players }: StatsViewProps) {
  const teamRating = getTeamAverage(players, 'rating')
  const offensiveRating = getOffensiveRating(players)
  const defensiveRating = getDefensiveRating(players)
  const bestAllAround = [...players].sort((a, b) => b.rating - a.rating)[0]

  const kpis = [
    { label: 'Team Rating', value: teamRating },
    { label: 'Offensive Rating', value: offensiveRating },
    { label: 'Defensive Rating', value: defensiveRating },
    { label: 'Average 3PT', value: getTeamAverage(players, 'threePoint') },
    { label: 'Average Rebounding', value: getTeamAverage(players, 'rebounding') },
  ]

  return (
    <section className="min-h-full p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h2 className="text-main font-display text-3xl">Team stats</h2>
          <p className="text-muted mt-2 text-sm">Local analytics generated from the demo roster.</p>
        </div>
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="chrome-surface rounded-xl border p-4">
              <p className="text-soft text-[11px] font-semibold">{kpi.label}</p>
              <p className="text-main mt-2 font-mono text-3xl font-black tabular-nums">{kpi.value}</p>
            </article>
          ))}
        </div>
        <div className="mb-6 grid gap-4 xl:grid-cols-[1.1fr_1fr]">
          <article className="chrome-surface rounded-xl border p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-soft text-[11px] font-semibold">Team shape</p>
                <p className="text-muted mt-1 text-xs">Rating by position - dot size tracks rating, dashed ring marks the top player.</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-main text-sm font-bold">{bestAllAround?.name}</p>
                <p className="text-soft text-[11px]">{bestAllAround?.position} · {bestAllAround?.rating} rating</p>
              </div>
            </div>
            <div className="mx-auto mt-3 h-64 max-w-[280px]">
              <MiniCourt
                players={players.map((player) => ({
                  id: player.id,
                  label: String(player.number),
                  position: player.position,
                  value: player.rating,
                  emphasized: player.id === bestAllAround?.id,
                }))}
              />
            </div>
          </article>
          <article className="chrome-surface rounded-xl border p-4">
            <p className="text-soft text-[11px] font-semibold">Metric comparison</p>
            <div className="mt-4 grid gap-2.5">
              {comparisonMetrics.map((metric) => {
                const value = getTeamAverage(players, metric.key)

                return (
                  <div key={metric.key} className="flex items-center justify-between gap-3">
                    <span className="text-muted text-sm">{metric.label}</span>
                    <div className="flex items-center gap-2.5">
                      <StatTicks value={value} />
                      <span className="text-main w-7 text-right font-mono text-xs font-bold tabular-nums">{value}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {statGroups.map((group) => (
            <article key={group.key} className="chrome-surface rounded-xl border p-4">
              <h3 className="text-main text-lg font-black">{group.title}</h3>
              <div className="mt-4 grid gap-2">
                {rankPlayersByStat(players, group.key).map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] py-2 last:border-b-0">
                    <div className="min-w-0">
                      <p className="text-main truncate text-sm font-bold">
                        {index + 1}. {player.name}
                      </p>
                      <p className="text-soft text-[11px]">{player.position} · {player.role}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <StatTicks value={player[group.key]} />
                      <span className="text-main w-7 text-right font-mono text-sm font-black tabular-nums">{player[group.key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
