import type { Play, PlayStep, Position } from '../../types/play'
import { getInitialPositions, getStepPositions } from '../../utils/positions'
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
}

export function Court({ play, positions, ballPosition, activeStep, activeStepIndex }: CourtProps) {
  const pathStartPositions =
    activeStepIndex > 0 ? getStepPositions(play, activeStepIndex - 1) : getInitialPositions(play.initialPlayers)
  const carrierId = activeStep?.ball?.carrierId ?? play.initialPlayers.find((player) => player.hasBall)?.id

  return (
    <section className="court-stage relative flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-[#0e0e10] p-3 sm:p-4 md:min-h-[min(64vh,760px)] md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,182,144,0.07),transparent_40%)]" />
      <div className="court-board relative aspect-[16/9] w-full max-w-[1160px] overflow-hidden rounded-md border-4 border-[#353437] bg-[#131315] shadow-[0_28px_60px_rgba(0,0,0,0.55)]">
        <CourtGrid />
        <div className="absolute inset-0 border border-[#ffb690]/20" />
        <CourtLines />
        <MovementPath fromPositions={pathStartPositions} step={activeStep} />
        {play.initialPlayers.map((player) => (
          <PlayerMarker
            key={player.id}
            player={player}
            position={positions[player.id] ?? player.position}
            isBallHandler={carrierId === player.id}
          />
        ))}
        <BallMarker position={ballPosition} />
      </div>
    </section>
  )
}
