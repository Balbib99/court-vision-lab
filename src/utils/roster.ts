import type { Player, Position, Team } from '../types/play'

const teamPrefixes: Record<Team, 'O' | 'D'> = {
  offense: 'O',
  defense: 'D',
}

const defaultPositions: Record<Team, Record<string, Position>> = {
  offense: {
    O1: { x: 31, y: 28 },
    O2: { x: 10, y: 45 },
    O3: { x: 10, y: 10 },
    O4: { x: 45, y: 39 },
    O5: { x: 45, y: 28 },
  },
  defense: {
    D1: { x: 34, y: 28 },
    D2: { x: 14, y: 42 },
    D3: { x: 14, y: 13 },
    D4: { x: 48, y: 40 },
    D5: { x: 48, y: 30 },
  },
}

export const maxPlayersPerTeam = 5

export const getTeamCount = (players: Player[], team: Team) =>
  players.filter((player) => player.team === team).length

export const getNextAvailablePlayerLabel = (players: Player[], team: Team) => {
  const prefix = teamPrefixes[team]
  const existingLabels = new Set(
    players.filter((player) => player.team === team).map((player) => player.label),
  )

  for (let index = 1; index <= maxPlayersPerTeam; index += 1) {
    const label = `${prefix}${index}`
    if (!existingLabels.has(label)) {
      return label
    }
  }

  return undefined
}

export const canAddPlayer = (players: Player[], team: Team) =>
  Boolean(getNextAvailablePlayerLabel(players, team))

export const getDefaultPlayerPosition = (
  players: Player[],
  team: Team,
  label: string,
) =>
  players.find((player) => player.team === team && player.label === label)?.position ??
  defaultPositions[team][label] ??
  { x: 50, y: 28 }

export const createRosterPlayer = (
  existingPlayers: Player[],
  referencePlayers: Player[],
  team: Team,
): Player | undefined => {
  const label = getNextAvailablePlayerLabel(existingPlayers, team)
  if (!label) {
    return undefined
  }

  const referencePlayer = referencePlayers.find((player) => player.team === team && player.label === label)
  const position = getDefaultPlayerPosition(referencePlayers, team, label)

  return {
    id: referencePlayer?.id ?? label.toLowerCase(),
    label,
    position,
    role: referencePlayer?.role ?? (team === 'offense' ? 'Added offensive player' : 'Added defensive player'),
    team,
  }
}
