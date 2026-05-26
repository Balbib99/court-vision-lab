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

  return (
    <div className={[
      'bottom-controls panel-floating z-30 mx-auto flex w-full flex-col rounded-2xl border px-4 py-3 sm:rounded-3xl sm:px-5',
      isCoachMode ? 'max-w-2xl gap-2' : 'max-w-4xl gap-3',
    ].join(' ')} data-guide="bottom-controls">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="bottom-controls-primary flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPlayFullSequence}
            disabled={isEditMode}
            className="control-button accent-bg flex h-11 w-11 items-center justify-center rounded-full transition hover:brightness-110"
            aria-label={isEditMode ? 'Playback disabled in edit mode' : isPlaying ? 'Pause full sequence' : 'Play full sequence'}
            title={isEditMode ? 'Playback disabled in edit mode' : isPlaying ? 'Pause sequence' : 'Play full sequence'}
            data-guide="play-sequence-button"
          >
            {isPlaying ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onPreviousStep}
            disabled={timelineDisabled || isFirstStep}
            className="control-button text-muted tactical-border flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous step"
            title="Previous step"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNextStep}
            disabled={timelineDisabled || isLastStep}
            className="control-button text-muted tactical-border flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next step"
            title="Next step"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onReset}
            className="control-button text-muted tactical-border flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-[var(--accent-muted)]"
            aria-label={isEditMode ? 'Reset positions' : 'Reset play'}
            title={isEditMode ? 'Reset positions' : 'Reset play'}
          >
            <RotateCcw size={17} aria-hidden="true" />
          </button>
          <div className="step-copy min-w-0">
            <p className="step-label text-soft font-mono text-[11px] uppercase tracking-[0.12em]">
              {isEditMode ? `Edit Step ${activeStepIndex + 1}/${stepCount}` : `Step ${activeStepIndex + 1}/${stepCount}`}
            </p>
            <p className="step-title text-main truncate text-sm font-bold">{isEditMode ? activeStep?.title ?? 'Drag players on court' : activeStep?.title ?? 'Ready'}</p>
          </div>
        </div>
        <div className="bottom-controls-meta text-muted flex items-center justify-between gap-6 font-mono text-xs sm:justify-end">
          <span className="inline-flex items-center gap-2">
            <Gauge size={16} aria-hidden="true" />
            1x
          </span>
          <span className="accent-text">{isEditMode ? 'EDIT' : isPlaying ? 'RUN' : 'HOLD'}</span>
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
                'timeline-step min-w-[126px] flex-1 rounded-md border px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-50',
                isActive
                  ? 'accent-badge'
                  : isComplete
                    ? 'tactical-border-strong bg-[var(--surface)]'
                    : 'tactical-border bg-[var(--surface-strong)]',
              ].join(' ')}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="accent-text font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-main mt-1 block truncate text-xs font-bold">{step.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
