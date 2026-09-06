import { ChevronLeft, ChevronRight, Gauge, Pause, Play, RotateCcw } from 'lucide-react'
import type { PlayStep } from '../../types/play'

type BottomControlsProps = {
  activeStep?: PlayStep
  activeStepIndex: number
  canNavigateInEditMode?: boolean
  isCoachMode?: boolean
  isEditMode: boolean
  isFirstStep: boolean
  isLastStep: boolean
  isPlaying: boolean
  onNextStep: () => void
  onPlayFullSequence: () => void
  onPreviousStep: () => void
  onReset: () => void
  onStepSelect: (stepIndex: number) => void
  steps: PlayStep[]
  stepCount: number
}

export function BottomControls({
  activeStep,
  activeStepIndex,
  canNavigateInEditMode = false,
  isCoachMode = false,
  isEditMode,
  isFirstStep,
  isLastStep,
  isPlaying,
  onNextStep,
  onPlayFullSequence,
  onPreviousStep,
  onReset,
  onStepSelect,
  steps,
  stepCount,
}: BottomControlsProps) {
  const timelineDisabled = isEditMode && !canNavigateInEditMode
  const statusState = isEditMode ? 'EDIT' : isPlaying ? 'RUN' : 'HOLD'
  const statusColor = statusState === 'RUN' ? 'var(--ball)' : statusState === 'EDIT' ? 'var(--offense)' : 'var(--text-main)'

  return (
    <div className={[
      'bottom-controls chrome-surface z-30 mx-auto flex w-full flex-col rounded-2xl border px-3 py-2.5 sm:rounded-3xl sm:px-4',
      isCoachMode ? 'max-w-2xl gap-2' : 'max-w-3xl gap-2.5',
    ].join(' ')} data-guide="bottom-controls">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="bottom-controls-primary flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPlayFullSequence}
            disabled={isEditMode}
            className="control-button chrome-btn-primary flex h-10 w-10 items-center justify-center rounded-full transition disabled:cursor-not-allowed"
            aria-label={isEditMode ? 'Playback disabled in edit mode' : isPlaying ? 'Pause full sequence' : 'Play full sequence'}
            title={isEditMode ? 'Playback disabled in edit mode' : isPlaying ? 'Pause sequence' : 'Play full sequence'}
            data-guide="play-sequence-button"
          >
            {isPlaying ? <Pause size={18} strokeWidth={1.75} aria-hidden="true" /> : <Play size={18} strokeWidth={1.75} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onPreviousStep}
            disabled={timelineDisabled || isFirstStep}
            className="control-button chrome-btn flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] transition disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous step"
            title="Previous step"
          >
            <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNextStep}
            disabled={timelineDisabled || isLastStep}
            className="control-button chrome-btn flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] transition disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next step"
            title="Next step"
          >
            <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="control-button chrome-btn flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] transition"
            aria-label={isEditMode ? 'Reset positions' : 'Reset play'}
            title={isEditMode ? 'Reset positions' : 'Reset play'}
          >
            <RotateCcw size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <div className="step-copy min-w-0">
            <p className="step-label text-soft text-[11px]">
              {isEditMode ? `Editing step ${activeStepIndex + 1} of ${stepCount}` : `Step ${activeStepIndex + 1} of ${stepCount}`}
            </p>
            <p className="step-title text-main truncate text-sm font-bold">{isEditMode ? activeStep?.title ?? 'Drag players on court' : activeStep?.title ?? 'Ready'}</p>
          </div>
        </div>
        <div className="bottom-controls-meta text-muted flex items-center justify-between gap-6 font-mono text-xs sm:justify-end">
          <span className="inline-flex items-center gap-2">
            <Gauge size={16} strokeWidth={1.75} aria-hidden="true" />
            1x
          </span>
          <span className="text-main inline-flex items-center gap-1.5 font-bold">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor }} aria-hidden="true" />
            {statusState}
          </span>
          <span>Q3</span>
        </div>
      </div>

      <div className={['play-timeline gap-2 overflow-x-auto pb-1', isCoachMode ? 'hidden sm:flex' : 'flex'].join(' ')} aria-label="Play timeline" data-guide="play-timeline">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex
          const isComplete = index < activeStepIndex

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect(index)}
              disabled={timelineDisabled}
              className={[
                'timeline-step min-w-[108px] flex-1 rounded-md border px-2.5 py-1.5 text-left transition disabled:cursor-not-allowed disabled:opacity-50',
                isActive
                  ? 'chrome-badge-active border-transparent'
                  : isComplete
                    ? 'chrome-btn border-[color:var(--border)]'
                    : 'chrome-btn border-[color:var(--border)] opacity-70',
              ].join(' ')}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className={['font-mono text-[10px] font-bold', isActive ? '' : 'text-[var(--text-soft)]'].join(' ')}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={['mt-1 block truncate text-xs font-bold', isActive ? '' : 'text-[var(--text-main)]'].join(' ')}>{step.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
