import type { Play, Player, Position, Team } from '../types/play'
import { clampPosition, getInitialPositions } from './positions'
import { maxPlayersPerTeam } from './roster'

export const boardStateVersion = 1

export type SavedBoardState = {
  version: typeof boardStateVersion
  selectedPlayId: string
  currentStepIndex: number
  players: Player[]
  positions: Record<string, Position>
  ballCarrierId?: string
  isCustom: boolean
  updatedAt: string
}

type BoardStateInput = Omit<SavedBoardState, 'version' | 'updatedAt'> & {
  updatedAt?: string
}

const teamPrefix: Record<Team, 'O' | 'D'> = {
  offense: 'O',
  defense: 'D',
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isPosition = (value: unknown): value is Position => {
  if (!isObject(value)) {
    return false
  }

  return typeof value.x === 'number' && Number.isFinite(value.x) && typeof value.y === 'number' && Number.isFinite(value.y)
}

const isValidPlayerLabel = (label: string, team: Team) => {
  const prefix = teamPrefix[team]
  return new RegExp(`^${prefix}[1-${maxPlayersPerTeam}]$`).test(label)
}

const normalizePlayer = (value: unknown): Player | undefined => {
  if (!isObject(value)) {
    return undefined
  }

  const { hasBall, id, label, position, role, team } = value
  if (
    typeof id !== 'string' ||
    typeof label !== 'string' ||
    (team !== 'offense' && team !== 'defense') ||
    !isPosition(position) ||
    !isValidPlayerLabel(label, team)
  ) {
    return undefined
  }

  return {
    id,
    label,
    position: clampPosition(position),
    role: typeof role === 'string' ? role : undefined,
    team,
    hasBall: typeof hasBall === 'boolean' ? hasBall : undefined,
  }
}

const normalizePlayers = (value: unknown) => {
  if (!Array.isArray(value)) {
    return undefined
  }

  const seenIds = new Set<string>()
  const seenLabels = new Set<string>()
  const teamCounts: Record<Team, number> = { offense: 0, defense: 0 }
  const players: Player[] = []

  value.forEach((item) => {
    const player = normalizePlayer(item)
    if (!player) {
      return
    }

    const labelKey = `${player.team}:${player.label}`
    if (seenIds.has(player.id) || seenLabels.has(labelKey) || teamCounts[player.team] >= maxPlayersPerTeam) {
      return
    }

    seenIds.add(player.id)
    seenLabels.add(labelKey)
    teamCounts[player.team] += 1
    players.push(player)
  })

  return players
}

const normalizePositions = (
  value: unknown,
  players: Player[],
) => {
  const playerIds = new Set(players.map((player) => player.id))
  const positions = getInitialPositions(players)

  if (!isObject(value)) {
    return positions
  }

  Object.entries(value).forEach(([playerId, position]) => {
    if (playerIds.has(playerId) && isPosition(position)) {
      positions[playerId] = clampPosition(position)
    }
  })

  return positions
}

export const createBoardState = ({
  ballCarrierId,
  currentStepIndex,
  isCustom,
  players,
  positions,
  selectedPlayId,
  updatedAt,
}: BoardStateInput): SavedBoardState => ({
  version: boardStateVersion,
  selectedPlayId,
  currentStepIndex: Math.max(0, currentStepIndex),
  players: players.map((player) => ({
    ...player,
    position: clampPosition(positions[player.id] ?? player.position),
    hasBall: player.id === ballCarrierId || undefined,
  })),
  positions: normalizePositions(positions, players),
  ballCarrierId: ballCarrierId && players.some((player) => player.id === ballCarrierId) ? ballCarrierId : undefined,
  isCustom,
  updatedAt: updatedAt ?? new Date().toISOString(),
})

export const normalizeBoardState = (
  value: unknown,
  plays: Play[],
): SavedBoardState | undefined => {
  if (!isObject(value) || value.version !== boardStateVersion || typeof value.selectedPlayId !== 'string') {
    return undefined
  }

  const selectedPlay = plays.find((play) => play.id === value.selectedPlayId)
  if (!selectedPlay) {
    return undefined
  }

  const players = normalizePlayers(value.players)
  if (!players) {
    return undefined
  }

  const positions = normalizePositions(value.positions, players)
  const ballCarrierId =
    typeof value.ballCarrierId === 'string' && players.some((player) => player.id === value.ballCarrierId)
      ? value.ballCarrierId
      : undefined
  const rawStepIndex = typeof value.currentStepIndex === 'number' && Number.isFinite(value.currentStepIndex)
    ? value.currentStepIndex
    : 0

  return createBoardState({
    selectedPlayId: selectedPlay.id,
    currentStepIndex: Math.min(Math.max(0, Math.floor(rawStepIndex)), selectedPlay.steps.length - 1),
    players,
    positions,
    ballCarrierId,
    isCustom: Boolean(value.isCustom),
  })
}
