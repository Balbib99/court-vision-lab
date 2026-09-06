import { motion } from 'framer-motion'
import type { Player, PlayStep, Position } from '../../types/play'

type MovementPathProps = {
  fromPositions: Record<string, Position>
  step?: PlayStep
  players?: Player[]
  ghostFromPositions?: Record<string, Position>
  ghostStep?: PlayStep
}

const roleColor = (players: Player[] | undefined, playerId: string): 'offense' | 'defense' =>
  players?.find((player) => player.id === playerId)?.team === 'defense' ? 'defense' : 'offense'

export function MovementPath({ fromPositions, ghostFromPositions, ghostStep, players, step }: MovementPathProps) {
  const hasActive = step && step.movements.length > 0
  const hasGhost = ghostStep && ghostStep.movements.length > 0

  if (!hasActive && !hasGhost) {
    return null
  }

  return (
    <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 56.25" preserveAspectRatio="none">
      <defs>
        <marker id="path-arrow-offense" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.4" markerHeight="4.4" orient="auto">
          <path d="M0 0.6 L7.4 4 L0 7.4 L1.6 4 Z" fill="var(--offense)" strokeLinejoin="round" />
        </marker>
        <marker id="path-arrow-defense" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="4.4" markerHeight="4.4" orient="auto">
          <path d="M0 0.6 L7.4 4 L0 7.4 L1.6 4 Z" fill="var(--defense)" strokeLinejoin="round" />
        </marker>
      </defs>
      {hasGhost &&
        ghostStep.movements.map((movement) => {
          const from = ghostFromPositions?.[movement.playerId]
          if (!from) {
            return null
          }

          return (
            <motion.line
              key={`ghost-${ghostStep.id}-${movement.playerId}`}
              x1={from.x}
              y1={from.y}
              x2={movement.to.x}
              y2={movement.to.y}
              stroke="var(--ghost-ink)"
              strokeDasharray="1.8 1.8"
              strokeLinecap="round"
              strokeWidth="0.5"
              filter="url(#ink-jitter)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          )
        })}
      {hasActive &&
        step.movements.map((movement) => {
          const from = fromPositions[movement.playerId]
          if (!from) {
            return null
          }

          const role = roleColor(players, movement.playerId)

          return (
            <motion.line
              key={`${step.id}-${movement.playerId}`}
              x1={from.x}
              y1={from.y}
              x2={movement.to.x}
              y2={movement.to.y}
              stroke={`var(--${role})`}
              strokeOpacity="0.85"
              strokeDasharray="1.8 1.8"
              strokeLinecap="round"
              strokeWidth="0.55"
              filter="url(#ink-jitter)"
              markerEnd={`url(#path-arrow-${role})`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          )
        })}
    </svg>
  )
}
