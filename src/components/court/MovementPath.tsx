import type { PlayStep, Position } from '../../types/play'

type MovementPathProps = {
  fromPositions: Record<string, Position>
  step?: PlayStep
}

export function MovementPath({ fromPositions, step }: MovementPathProps) {
  if (!step || step.movements.length === 0) {
    return null
  }

  return (
    <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 56.25" preserveAspectRatio="none">
      <defs>
        <marker id="path-arrow" viewBox="0 0 8 8" refX="6.2" refY="4" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="rgba(249,115,22,0.72)" />
        </marker>
      </defs>
      {step.movements.map((movement) => {
        const from = fromPositions[movement.playerId]
        if (!from) {
          return null
        }

        return (
          <line
            key={`${step.id}-${movement.playerId}`}
            x1={from.x}
            y1={from.y}
            x2={movement.to.x}
            y2={movement.to.y}
            stroke="rgba(249,115,22,0.45)"
            strokeDasharray="1.8 1.8"
            strokeLinecap="round"
            strokeWidth="0.42"
            markerEnd="url(#path-arrow)"
          />
        )
      })}
    </svg>
  )
}
