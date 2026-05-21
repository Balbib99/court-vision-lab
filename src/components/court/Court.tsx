import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { DrawingTool, Play, Player, PlayStep, Position, TacticalAnnotation as TacticalAnnotationType } from '../../types/play'
import { fromClientPoint, getInitialPositions, getStepPositions } from '../../utils/positions'
import { BallMarker } from './BallMarker'
import { CourtGrid } from './CourtGrid'
import { CourtLines } from './CourtLines'
import { MovementPath } from './MovementPath'
import { PlayerMarker } from './PlayerMarker'
import { TacticalAnnotationsLayer } from './TacticalAnnotationsLayer'

type CourtProps = {
  play: Play
  positions: Record<string, Position>
  ballPosition?: Position
  activeStep?: PlayStep
  activeStepIndex: number
  activeTool?: DrawingTool
  annotations?: TacticalAnnotationType[]
  ballCarrierId?: string
  canEditAnnotations?: boolean
  isCoachMode?: boolean
  isEditMode?: boolean
  onCreateAnnotation?: (annotation: Omit<TacticalAnnotationType, 'id' | 'createdAt'>) => void
  onEraseAnnotation?: (annotationId: string) => void
  onMovePlayer?: (playerId: string, position: Position) => void
  onSelectPlayer?: (playerId: string) => void
  players?: Player[]
  selectedPlayerId?: string
}

export function Court({
  play,
  positions,
  ballPosition,
  activeStep,
  activeStepIndex,
  activeTool = 'select',
  annotations = [],
  ballCarrierId,
  canEditAnnotations = false,
  isCoachMode = false,
  isEditMode = false,
  onCreateAnnotation,
  onEraseAnnotation,
  onMovePlayer,
  onSelectPlayer,
  players,
  selectedPlayerId,
}: CourtProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [draggingPlayerId, setDraggingPlayerId] = useState<string>()
  const [drawingStart, setDrawingStart] = useState<Position>()
  const [drawingPreview, setDrawingPreview] = useState<{ from: Position; to: Position; type: 'movement' | 'pass' }>()
  const pathStartPositions =
    activeStepIndex > 0 ? getStepPositions(play, activeStepIndex - 1) : getInitialPositions(play.initialPlayers)
  const carrierId = ballCarrierId ?? activeStep?.ball?.carrierId ?? play.initialPlayers.find((player) => player.hasBall)?.id
  const visiblePlayers = players ?? play.initialPlayers

  const isDrawingTool = activeTool === 'movement' || activeTool === 'pass' || activeTool === 'screen'

  const getCourtPoint = (event: PointerEvent<HTMLDivElement>) => {
    if (!boardRef.current) {
      return undefined
    }

    return fromClientPoint(event.clientX, event.clientY, boardRef.current.getBoundingClientRect())
  }

  const handleBoardPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isEditMode || !canEditAnnotations || !isDrawingTool) {
      return
    }

    const point = getCourtPoint(event)
    if (!point) {
      return
    }

    event.preventDefault()
    if (activeTool === 'screen') {
      onCreateAnnotation?.({ type: 'screen', position: point })
      return
    }

    setDrawingStart(point)
    setDrawingPreview({ from: point, to: point, type: activeTool })
  }

  const moveDraggedPlayer = (event: PointerEvent<HTMLDivElement>) => {
    if (drawingStart && drawingPreview && isDrawingTool) {
      const point = getCourtPoint(event)
      if (point) {
        setDrawingPreview({ ...drawingPreview, to: point })
      }
      return
    }

    if (!isEditMode || !draggingPlayerId || !boardRef.current) {
      return
    }

    onMovePlayer?.(draggingPlayerId, fromClientPoint(event.clientX, event.clientY, boardRef.current.getBoundingClientRect()))
  }

  const stopDragging = () => {
    if (drawingStart && drawingPreview && (activeTool === 'movement' || activeTool === 'pass')) {
      const distance = Math.hypot(drawingPreview.to.x - drawingStart.x, drawingPreview.to.y - drawingStart.y)
      if (distance > 2.5) {
        onCreateAnnotation?.({
          type: activeTool,
          from: drawingStart,
          to: drawingPreview.to,
        })
      }
    }

    setDrawingStart(undefined)
    setDrawingPreview(undefined)
    setDraggingPlayerId(undefined)
  }

  return (
    <section className={[
      'court-stage relative flex w-full items-center justify-center overflow-hidden bg-transparent p-3 sm:p-4 md:p-8',
      isCoachMode ? 'min-h-[calc(100dvh-180px)] md:min-h-[calc(100dvh-170px)]' : 'min-h-[420px] md:min-h-[min(64vh,760px)]',
    ].join(' ')}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent-muted),transparent_42%)]" />
      <div
        ref={boardRef}
        className={[
          'court-board court-surface relative aspect-[16/9] w-full overflow-hidden rounded-md border-4',
          isCoachMode ? 'max-w-[1440px]' : 'max-w-[1160px]',
          isEditMode ? 'touch-none' : '',
        ].join(' ')}
        onPointerDown={handleBoardPointerDown}
        onPointerMove={moveDraggedPlayer}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onPointerLeave={stopDragging}
      >
        <CourtGrid />
        <div className="absolute inset-0 border border-[color:var(--border-strong)]" />
        <CourtLines />
        {!isEditMode && <MovementPath fromPositions={pathStartPositions} step={activeStep} />}
        <TacticalAnnotationsLayer
          annotations={annotations}
          eraseEnabled={isEditMode && canEditAnnotations && activeTool === 'erase'}
          onEraseAnnotation={onEraseAnnotation}
          preview={drawingPreview}
        />
        {visiblePlayers.map((player) => (
          <PlayerMarker
            key={player.id}
            player={player}
            position={positions[player.id] ?? player.position}
            isEditable={isEditMode}
            isBallHandler={carrierId === player.id}
            isSelected={selectedPlayerId === player.id}
            onPointerDown={(event) => {
              if (!isEditMode || activeTool !== 'select') {
                return
              }

              event.preventDefault()
              event.stopPropagation()
              onSelectPlayer?.(player.id)
              setDraggingPlayerId(player.id)
            }}
          />
        ))}
        {ballPosition && <BallMarker position={ballPosition} />}
      </div>
    </section>
  )
}
