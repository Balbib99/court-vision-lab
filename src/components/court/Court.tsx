import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { Play, PlayStep, Position } from '../../types/play'
import { fromClientPoint, getInitialPositions, getStepPositions } from '../../utils/positions'
import { BallMarker } from './BallMarker'
import { CourtGrid } from './CourtGrid'
import { CourtLines } from './CourtLines'
import { MovementPath } from './MovementPath'
import { PlayerMarker } from './PlayerMarker'

type CourtProps = {
  play: Play
  positions: Record<string, Position>
  ballPosition: Position
  activeStep?: PlayStep
  activeStepIndex: number
  ballCarrierId?: string
  isEditMode?: boolean
  onMovePlayer?: (playerId: string, position: Position) => void
  onSelectPlayer?: (playerId: string) => void
  selectedPlayerId?: string
}

export function Court({
  play,
  positions,
  ballPosition,
  activeStep,
  activeStepIndex,
  ballCarrierId,
  isEditMode = false,
  onMovePlayer,
  onSelectPlayer,
  selectedPlayerId,
}: CourtProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [draggingPlayerId, setDraggingPlayerId] = useState<string>()
  const pathStartPositions =
    activeStepIndex > 0 ? getStepPositions(play, activeStepIndex - 1) : getInitialPositions(play.initialPlayers)
  const carrierId = ballCarrierId ?? activeStep?.ball?.carrierId ?? play.initialPlayers.find((player) => player.hasBall)?.id

  const moveDraggedPlayer = (event: PointerEvent<HTMLDivElement>) => {
    if (!isEditMode || !draggingPlayerId || !boardRef.current) {
      return
    }

    onMovePlayer?.(draggingPlayerId, fromClientPoint(event.clientX, event.clientY, boardRef.current.getBoundingClientRect()))
  }

  const stopDragging = () => setDraggingPlayerId(undefined)

  return (
    <section className="court-stage relative flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-transparent p-3 sm:p-4 md:min-h-[min(64vh,760px)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-muted),transparent_42%)]" />
      <div
        ref={boardRef}
        className={[
          'court-board court-surface relative aspect-[16/9] w-full max-w-[1160px] overflow-hidden rounded-md border-4',
          isEditMode ? 'touch-none' : '',
        ].join(' ')}
        onPointerMove={moveDraggedPlayer}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
      >
        <CourtGrid />
        <div className="absolute inset-0 border border-[color:var(--border-strong)]" />
        <CourtLines />
        {!isEditMode && <MovementPath fromPositions={pathStartPositions} step={activeStep} />}
        {play.initialPlayers.map((player) => (
          <PlayerMarker
            key={player.id}
            player={player}
            position={positions[player.id] ?? player.position}
            isEditable={isEditMode}
            isBallHandler={carrierId === player.id}
            isSelected={selectedPlayerId === player.id}
            onPointerDown={(event) => {
              if (!isEditMode) {
                return
              }

              event.preventDefault()
              event.stopPropagation()
              onSelectPlayer?.(player.id)
              setDraggingPlayerId(player.id)
            }}
          />
        ))}
        <BallMarker position={ballPosition} />
      </div>
    </section>
  )
}
