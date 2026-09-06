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
  onAddCoachingPoint?: () => void
  onAddStep?: () => void
  onClearStepAnnotations?: () => void
  onDeleteCoachingPoint?: (index: number) => void
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
  onAddCoachingPoint,
  onAddStep,
  onClearStepAnnotations,
  onDeleteCoachingPoint,
  onDeleteStep,
  onEditStepDescription,
  onRenameStep,
  onSelectTool,
  onToggleCollapsed,
  onUpdateStep,
}: PlayDetailsPanelProps) {
  const selectedPlayerHasBall = Boolean(selectedPlayer && selectedPlayer.id === ballCarrierId)

  return (
    <aside className={['play-details-panel chrome-surface w-full border-t p-4 pb-8 xl:absolute xl:left-6 xl:top-6 xl:z-30 xl:max-h-[calc(100dvh-190px)] xl:w-[340px] xl:overflow-y-auto xl:overscroll-contain xl:border xl:pb-4 xl:pr-3', isCollapsed ? 'hidden' : ''].join(' ')}>
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="chrome-surface chrome-btn mb-4 flex h-9 w-full items-center justify-center gap-2 rounded-md border transition"
        aria-label="Collapse tactical panel"
        title="Collapse tactical panel"
      >
        <PanelLeftClose size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="text-[11px] font-bold">Collapse panel</span>
      </button>
      <div className="play-details-selector">
        <PlaySelector plays={plays} selectedPlayId={play.id} onSelect={onSelectPlay} />
      </div>

      <div className="play-details-header mt-5 border-t border-[color:var(--border)] pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-soft text-[11px] font-semibold">{play.category}</p>
            <h2 className="text-main mt-1 font-display text-2xl">{play.name}</h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            {(play.source === 'custom' || play.isCustom) && (
              <span className="chrome-surface rounded-sm border px-2 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                Custom
              </span>
            )}
            <span className="chrome-surface rounded-sm border px-2 py-1 text-[11px] font-bold text-[var(--text-muted)]">
              {play.difficulty}
            </span>
          </div>
        </div>
        <p className="play-description text-muted mt-4 text-sm leading-6">{play.description}</p>
      </div>

      <div className="play-objective mt-5 border-t border-[color:var(--border)] pt-5">
        <h3 className="text-soft text-[11px] font-bold">Objective</h3>
        <p className="text-muted mt-2 text-sm leading-6">{play.objective}</p>
      </div>

      <div className="strategy-notes mt-5 border-t border-[color:var(--border)] pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-soft text-[11px] font-bold">Coaching points</h3>
          {canEditTimeline && (
            <button
              type="button"
              onClick={onAddCoachingPoint}
              className="chrome-btn rounded-sm px-2 py-1 text-[11px] font-bold transition"
              aria-label="Add coaching point"
              title="Add coaching point"
            >
              Add
            </button>
          )}
        </div>
        <div className="mt-3 grid gap-2">
          {(play.coachingPoints?.length ? play.coachingPoints : ['Keep spacing balanced before the action starts.', 'Read the help defender before committing to the pass.']).map((note, index) => (
            <div key={`${note}-${index}`} className="border border-[color:var(--border)] flex items-start justify-between gap-3 rounded-md p-2 text-xs text-[var(--text-muted)]">
              <span>{note}</span>
              {canEditTimeline && play.coachingPoints?.length ? (
                <button
                  type="button"
                  onClick={() => onDeleteCoachingPoint?.(index)}
                  className="text-[var(--defense)] transition hover:opacity-80"
                  aria-label={`Delete coaching point ${index + 1}`}
                  title="Delete coaching point"
                >
                  ×
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="current-read mt-5 border-t border-[color:var(--border)] pt-5">
        <h3 className="text-soft text-[11px] font-bold">
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
              <p className="text-soft mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ballCarrierId === selectedPlayer.id ? 'var(--ball)' : 'var(--border)' }}
                  aria-hidden="true"
                />
                {ballCarrierId === selectedPlayer.id ? 'Has ball' : 'No ball'}
              </p>
            )}
            <button
              type="button"
              onClick={onAssignBall}
              disabled={!selectedPlayer || selectedPlayerHasBall}
              className="chrome-btn-primary mt-3 rounded-md px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed"
            >
              {selectedPlayerHasBall ? 'Has ball' : selectedPlayer ? 'Assign ball' : 'Select player'}
            </button>
          </div>
        ) : (
          <>
            <p className="text-main mt-2 text-sm font-bold">{activeStep?.title}</p>
            <p className="current-read-description text-muted mt-1 text-sm leading-6">{activeStep?.description}</p>
          </>
        )}
      </div>

      <div className="timeline-editor mt-5 border-t border-[color:var(--border)] pt-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-soft text-[11px] font-bold">Step editor</h3>
          {!canEditTimeline && (
            <span className="text-soft text-[10px]">Duplicate to edit</span>
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
              className="chrome-surface chrome-btn rounded-md border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed"
              aria-label={item.title}
              title={item.title}
              data-guide={item.label === '+ Step' ? 'add-step-button' : item.label === 'Update' ? 'update-step-button' : undefined}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onDeleteStep}
            disabled={!canEditTimeline || play.steps.length <= 1}
            className="chrome-surface chrome-btn col-span-2 rounded-md border px-3 py-2 text-xs font-bold text-[var(--defense)] transition disabled:cursor-not-allowed"
            aria-label={canEditTimeline ? 'Delete current step' : 'Available for custom plays'}
            title={play.steps.length <= 1 ? 'A custom play needs at least one step' : canEditTimeline ? 'Delete current step' : 'Available for custom plays'}
          >
            Delete step
          </button>
          <button
            type="button"
            onClick={onClearStepAnnotations}
            disabled={!canEditTimeline || (activeStep?.annotations ?? []).length === 0}
            className="chrome-surface chrome-btn col-span-2 rounded-md border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed"
            aria-label="Clear annotations for current step"
            title={(activeStep?.annotations ?? []).length === 0 ? 'No annotations on this step' : 'Clear annotations for current step'}
            data-guide="clear-annotations-button"
          >
            Clear annotations
          </button>
        </div>
      </div>

      <div className="annotation-tools mt-5 border-t border-[color:var(--border)] pt-5 lg:hidden">
        <h3 className="text-soft text-[11px] font-bold">Drawing tools</h3>
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
                  'rounded-md border px-2 py-2 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40',
                  isActive ? 'chrome-btn-active border-transparent' : 'chrome-surface chrome-btn',
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

      <ol className="play-steps mt-5 grid gap-2 border-t border-[color:var(--border)] pt-5">
        {play.steps.map((step, index) => {
          const isActive = index === activeStepIndex
          const isDone = index < activeStepIndex

          return (
            <li
              key={step.id}
              className={[
                'border px-3 py-2 text-sm',
                isActive
                  ? 'chrome-badge-active border-transparent'
                  : isDone
                    ? 'chrome-btn border-[color:var(--border)]'
                    : 'chrome-btn border-[color:var(--border)] opacity-70',
              ].join(' ')}
            >
              <span className={['font-mono text-[11px]', isActive ? '' : 'text-[var(--text-soft)]'].join(' ')}>{String(index + 1).padStart(2, '0')}</span>
              <span className={['ml-3 font-semibold', isActive ? '' : 'text-[var(--text-main)]'].join(' ')}>{step.title}</span>
            </li>
          )
        })}
      </ol>

      <div className="play-concepts mt-5 flex flex-wrap gap-2">
        {play.concepts.map((concept) => (
          <span key={concept} className="border-l-2 border-l-[var(--text-soft)] bg-[color:var(--chrome-surface)] px-2.5 py-1 text-[11px] text-[var(--text-muted)]">
            {concept}
          </span>
        ))}
      </div>
    </aside>
  )
}
