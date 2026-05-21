import type { RosterPlayer } from '../data/roster'

export type RosterStatKey = 'shooting' | 'threePoint' | 'passing' | 'rebounding' | 'defense' | 'speed' | 'finishing'

export const statGroups: Array<{ title: string; key: RosterStatKey }> = [
  { title: 'Best Shooters', key: 'shooting' },
  { title: 'Best 3PT Shooters', key: 'threePoint' },
  { title: 'Best Rebounders', key: 'rebounding' },
  { title: 'Best Passers', key: 'passing' },
  { title: 'Best Defenders', key: 'defense' },
  { title: 'Fastest Players', key: 'speed' },
  { title: 'Best Finishers', key: 'finishing' },
]

export const rankPlayersByStat = (players: RosterPlayer[], key: RosterStatKey) =>
  [...players].sort((a, b) => b[key] - a[key]).slice(0, 5)

export const getTeamAverage = (players: RosterPlayer[], key: RosterStatKey | 'rating') => {
  if (players.length === 0) {
    return 0
  }

  return Math.round(players.reduce((total, player) => total + player[key], 0) / players.length)
}

export const getOffensiveRating = (players: RosterPlayer[]) =>
  Math.round((getTeamAverage(players, 'shooting') + getTeamAverage(players, 'passing') + getTeamAverage(players, 'finishing')) / 3)

export const getDefensiveRating = (players: RosterPlayer[]) =>
  Math.round((getTeamAverage(players, 'defense') + getTeamAverage(players, 'rebounding')) / 2)
