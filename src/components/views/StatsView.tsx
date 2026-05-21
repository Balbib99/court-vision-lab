import type { RosterPlayer } from '../../data/roster'
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
          <p className="accent-text font-mono text-xs font-bold uppercase tracking-[0.16em]">Analytics</p>
          <h2 className="text-main mt-2 font-display text-3xl tracking-[0.05em]">Team Stats</h2>
          <p className="text-muted mt-2 text-sm">Local analytics generated from the demo roster.</p>
        </div>
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="panel-floating rounded-xl border p-4">
              <p className="text-soft font-mono text-[10px] font-bold uppercase tracking-[0.12em]">{kpi.label}</p>
              <p className="accent-text mt-2 text-3xl font-black">{kpi.value}</p>
            </article>
          ))}
        </div>
        <div className="mb-6 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <article className="panel-floating rounded-xl border p-4">
            <p className="text-soft font-mono text-[10px] font-bold uppercase tracking-[0.12em]">Player Efficiency</p>
            <h3 className="text-main mt-2 text-xl font-black">{bestAllAround?.name}</h3>
            <p className="text-muted mt-1 text-sm">{bestAllAround?.position} · {bestAllAround?.role}</p>
            <p className="accent-text mt-4 text-5xl font-black">{bestAllAround?.rating}</p>
          </article>
          <article className="panel-floating rounded-xl border p-4">
            <p className="text-soft font-mono text-[10px] font-bold uppercase tracking-[0.12em]">Metric Comparison</p>
            <div className="mt-4 grid gap-3">
              {comparisonMetrics.map((metric) => {
                const value = getTeamAverage(players, metric.key)

                return (
                  <div key={metric.key}>
                    <div className="mb-1 flex justify-between font-mono text-[11px] uppercase text-[var(--text-muted)]">
                      <span>{metric.label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {statGroups.map((group) => (
            <article key={group.key} className="panel-floating rounded-xl border p-4">
              <h3 className="text-main text-lg font-black">{group.title}</h3>
              <div className="mt-4 grid gap-3">
                {rankPlayersByStat(players, group.key).map((player, index) => (
                  <div key={player.id} className="panel rounded-md border p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-main truncate text-sm font-bold">
                          {index + 1}. {player.name}
                        </p>
                        <p className="text-soft font-mono text-[10px] uppercase tracking-[0.1em]">{player.position} · {player.role}</p>
                      </div>
                      <span className="accent-text font-mono text-lg font-black">{player[group.key]}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
                      <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${player[group.key]}%` }} />
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
