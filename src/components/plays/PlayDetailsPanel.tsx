import type { Play, Player, PlayStep } from '../../types/play'
import { PlaySelector } from './PlaySelector'

type PlayDetailsPanelProps = {
  activeStep?: PlayStep
  activeStepIndex: number
  onSelectPlay: (playId: string) => void
  play: Play
  plays: Play[]
  isEditMode: boolean
  selectedPlayer?: Player
  ballCarrierId?: string
  onAssignBall: () => void
}

export function PlayDetailsPanel({
  activeStep,
  activeStepIndex,
  onSelectPlay,
  play,
  plays,
  isEditMode,
  selectedPlayer,
  ballCarrierId,
  onAssignBall,
}: PlayDetailsPanelProps) {
  const selectedPlayerHasBall = Boolean(selectedPlayer && selectedPlayer.id === ballCarrierId)

  return (
    <aside className="play-details-panel panel-floating w-full border-t p-4 pb-8 xl:absolute xl:left-6 xl:top-6 xl:z-30 xl:w-[340px] xl:border xl:pb-4">
      <div className="play-details-selector">
        <PlaySelector plays={plays} selectedPlayId={play.id} onSelect={onSelectPlay} />
      </div>

      <div className="play-details-header tactical-border mt-5 border-t pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="accent-text font-mono text-[11px] uppercase tracking-[0.16em]">{play.category}</p>
            <h2 className="text-main mt-1 font-display text-2xl tracking-[0.05em]">{play.name}</h2>
          </div>
          <span className="accent-badge rounded-sm px-2 py-1 font-mono text-[11px] font-bold">
            {play.difficulty}
          </span>
        </div>
        <p className="play-description text-muted mt-4 text-sm leading-6">{play.description}</p>
      </div>

      <div className="play-objective tactical-border mt-5 border-t pt-5">
        <h3 className="text-soft font-mono text-[11px] uppercase tracking-[0.16em]">Objective</h3>
        <p className="text-muted mt-2 text-sm leading-6">{play.objective}</p>
      </div>

      <div className="current-read tactical-border mt-5 border-t pt-5">
        <h3 className="text-soft font-mono text-[11px] uppercase tracking-[0.16em]">
          {isEditMode ? 'Selected player' : 'Current read'}
        </h3>
        {isEditMode ? (
          <div className="mt-2">
            <p className="text-main text-sm font-bold">{selectedPlayer?.label ?? 'No player selected'}</p>
            <p className="current-read-description text-muted mt-1 text-sm leading-6">
              {selectedPlayer
                ? `${selectedPlayer.team} ${selectedPlayer.role ? `- ${selectedPlayer.role}` : ''}`
                : 'Select a player on the court to inspect or assign the ball.'}
            </p>
            {selectedPlayer && (
              <p className="accent-text mt-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                {ballCarrierId === selectedPlayer.id ? 'Has ball' : 'No ball'}
              </p>
            )}
            <button
              type="button"
              onClick={onAssignBall}
              disabled={!selectedPlayer || selectedPlayerHasBall}
              className="accent-badge mt-3 rounded-md px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {selectedPlayerHasBall ? 'Has Ball' : selectedPlayer ? 'Assign Ball' : 'Select player'}
            </button>
          </div>
        ) : (
          <>
            <p className="text-main mt-2 text-sm font-bold">{activeStep?.title}</p>
            <p className="current-read-description text-muted mt-1 text-sm leading-6">{activeStep?.description}</p>
          </>
        )}
      </div>

      <ol className="play-steps tactical-border mt-5 grid gap-2 border-t pt-5">
        {play.steps.map((step, index) => {
          const isActive = index === activeStepIndex
          const isDone = index < activeStepIndex

          return (
            <li
              key={step.id}
              className={[
                'border px-3 py-2 text-sm',
                isActive
                  ? 'accent-badge'
                  : isDone
                    ? 'tactical-border-strong bg-[var(--surface)]'
                    : 'tactical-border bg-[var(--surface-strong)]',
              ].join(' ')}
            >
              <span className="accent-text font-mono text-[11px]">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-main ml-3 font-semibold">{step.title}</span>
            </li>
          )
        })}
      </ol>

      <div className="play-concepts mt-5 flex flex-wrap gap-2">
        {play.concepts.map((concept) => (
          <span key={concept} className="accent-badge border-l-2 border-l-[var(--accent)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide">
            {concept}
          </span>
        ))}
      </div>
    </aside>
  )
}
