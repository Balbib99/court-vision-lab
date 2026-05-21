import type { DrawingTool, Play, Player, PlayStep } from '../../types/play'
import { PanelLeftClose } from 'lucide-react'
import { PlaySelector } from './PlaySelector'

type PlayDetailsPanelProps = {
  activeStep?: PlayStep
  activeStepIndex: number
  activeTool?: DrawingTool
  isCollapsed?: boolean
  onSelectPlay: (playId: string) => void
  play: Play
  plays: Play[]
  isEditMode: boolean
  selectedPlayer?: Player
  ballCarrierId?: string
  canEditTimeline?: boolean
  onAssignBall: () => void
  onAddStep?: () => void
  onClearStepAnnotations?: () => void
  onDeleteStep?: () => void
  onEditStepDescription?: () => void
  onRenameStep?: () => void
  onSelectTool?: (tool: DrawingTool) => void
  onToggleCollapsed?: () => void
  onUpdateStep?: () => void
}

export function PlayDetailsPanel({
  activeStep,
  activeStepIndex,
  activeTool = 'select',
  isCollapsed = false,
  onSelectPlay,
  play,
  plays,
  isEditMode,
  selectedPlayer,
  ballCarrierId,
  canEditTimeline = false,
  onAssignBall,
  onAddStep,
  onClearStepAnnotations,
  onDeleteStep,
  onEditStepDescription,
  onRenameStep,
  onSelectTool,
  onToggleCollapsed,
  onUpdateStep,
}: PlayDetailsPanelProps) {
  const selectedPlayerHasBall = Boolean(selectedPlayer && selectedPlayer.id === ballCarrierId)

  return (
    <aside className={['play-details-panel panel-floating w-full border-t p-4 pb-8 xl:absolute xl:left-6 xl:top-6 xl:z-30 xl:max-h-[calc(100dvh-190px)] xl:w-[340px] xl:overflow-y-auto xl:overscroll-contain xl:border xl:pb-4 xl:pr-3', isCollapsed ? 'hidden' : ''].join(' ')}>
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="panel mb-4 flex h-9 w-full items-center justify-center gap-2 rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)]"
        aria-label="Collapse tactical panel"
        title="Collapse tactical panel"
      >
        <PanelLeftClose size={16} aria-hidden="true" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em]">Collapse Panel</span>
      </button>
      <div className="play-details-selector">
        <PlaySelector plays={plays} selectedPlayId={play.id} onSelect={onSelectPlay} />
      </div>

      <div className="play-details-header tactical-border mt-5 border-t pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="accent-text font-mono text-[11px] uppercase tracking-[0.16em]">{play.category}</p>
            <h2 className="text-main mt-1 font-display text-2xl tracking-[0.05em]">{play.name}</h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            {(play.source === 'custom' || play.isCustom) && (
              <span className="panel rounded-sm border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Custom
              </span>
            )}
            <span className="accent-badge rounded-sm px-2 py-1 font-mono text-[11px] font-bold">
              {play.difficulty}
            </span>
          </div>
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
            <p className="text-main text-sm font-bold">{selectedPlayer ? `${selectedPlayer.label}${selectedPlayer.name ? ` - ${selectedPlayer.name}` : ''}` : 'No player selected'}</p>
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

      <div className="timeline-editor tactical-border mt-5 border-t pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-soft font-mono text-[11px] uppercase tracking-[0.16em]">Step Editor</h3>
          {!canEditTimeline && (
            <span className="text-soft font-mono text-[10px] uppercase tracking-[0.12em]">Duplicate to edit</span>
          )}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: '+ Step', action: onAddStep, title: canEditTimeline ? 'Add step from current board' : 'Available for custom plays' },
            { label: 'Update', action: onUpdateStep, title: canEditTimeline ? 'Update current step' : 'Available for custom plays' },
            { label: 'Rename', action: onRenameStep, title: canEditTimeline ? 'Rename current step' : 'Available for custom plays' },
            { label: 'Describe', action: onEditStepDescription, title: canEditTimeline ? 'Edit step description' : 'Available for custom plays' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              disabled={!canEditTimeline}
              className="panel rounded-md border px-3 py-2 text-xs font-bold text-[var(--text-main)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={item.title}
              title={item.title}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onDeleteStep}
            disabled={!canEditTimeline || play.steps.length <= 1}
            className="panel col-span-2 rounded-md border px-3 py-2 text-xs font-bold text-[var(--defense)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={canEditTimeline ? 'Delete current step' : 'Available for custom plays'}
            title={play.steps.length <= 1 ? 'A custom play needs at least one step' : canEditTimeline ? 'Delete current step' : 'Available for custom plays'}
          >
            Delete Step
          </button>
          <button
            type="button"
            onClick={onClearStepAnnotations}
            disabled={!canEditTimeline || (activeStep?.annotations ?? []).length === 0}
            className="panel col-span-2 rounded-md border px-3 py-2 text-xs font-bold text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Clear annotations for current step"
            title={(activeStep?.annotations ?? []).length === 0 ? 'No annotations on this step' : 'Clear annotations for current step'}
          >
            Clear Annotations
          </button>
        </div>
      </div>

      <div className="annotation-tools tactical-border mt-5 border-t pt-5 lg:hidden">
        <h3 className="text-soft font-mono text-[11px] uppercase tracking-[0.16em]">Drawing Tools</h3>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: 'Move', tool: 'movement' },
            { label: 'Pass', tool: 'pass' },
            { label: 'Screen', tool: 'screen' },
            { label: 'Erase', tool: 'erase' },
          ].map((item) => {
            const tool = item.tool as DrawingTool
            const disabled = !canEditTimeline || (tool !== 'select' && !isEditMode)
            const isActive = activeTool === tool

            return (
              <button
                key={tool}
                type="button"
                onClick={() => onSelectTool?.(tool)}
                disabled={disabled}
                className={[
                  'rounded-md border px-2 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] transition disabled:cursor-not-allowed disabled:opacity-40',
                  isActive ? 'accent-badge' : 'panel text-[var(--text-muted)] hover:bg-[var(--accent-muted)]',
                ].join(' ')}
                aria-label={disabled ? 'Duplicate this play to edit annotations' : item.label}
                title={disabled ? 'Duplicate this play to edit annotations' : item.label}
              >
                {item.label}
              </button>
            )
          })}
        </div>
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
