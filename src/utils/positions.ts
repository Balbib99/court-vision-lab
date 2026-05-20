import type { Player, Play, Position } from '../types/play'

export const COURT_WIDTH = 100
export const COURT_HEIGHT = 56.25

export const clampPosition = ({ x, y }: Position): Position => ({
  x: Math.min(COURT_WIDTH, Math.max(0, x)),
  y: Math.min(COURT_HEIGHT, Math.max(0, y)),
})

export const toPercent = ({ x, y }: Position) => ({
  left: `${(x / COURT_WIDTH) * 100}%`,
  top: `${(y / COURT_HEIGHT) * 100}%`,
})

export const getInitialPositions = (players: Player[]): Record<string, Position> =>
  players.reduce<Record<string, Position>>((positions, player) => {
    positions[player.id] = clampPosition(player.position)
    return positions
  }, {})

export const getStepPositions = (
  play: Play,
  stepIndex: number,
): Record<string, Position> => {
  const positions = getInitialPositions(play.initialPlayers)

  play.steps.slice(0, stepIndex + 1).forEach((step) => {
    step.movements.forEach((movement) => {
      positions[movement.playerId] = clampPosition(movement.to)
    })
  })

  return positions
}

export const getBallHandler = (play: Play) =>
  play.initialPlayers.find((player) => player.hasBall) ?? play.initialPlayers[0]

export const resolveBallPosition = (
  positions: Record<string, Position>,
  carrierId?: string,
  fallback?: Position,
): Position => {
  if (carrierId && positions[carrierId]) {
    return positions[carrierId]
  }

  return fallback ?? { x: 50, y: 28.125 }
}
