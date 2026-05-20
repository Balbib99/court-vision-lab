import { ChevronLeft, ChevronRight, Gauge, Pause, Play, RotateCcw } from 'lucide-react'
import type { PlayStep } from '../../types/play'

type BottomControlsProps = {
  activeStep?: PlayStep
  activeStepIndex: number
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
  return (
    <div className="bottom-controls panel-glass z-30 mx-auto flex w-full max-w-4xl flex-col gap-3 rounded-2xl border px-4 py-3 sm:rounded-3xl sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="bottom-controls-primary flex items-center gap-2.5">
          <button
            type="button"
            onClick={onPlayFullSequence}
            className="control-button accent-bg flex h-11 w-11 items-center justify-center rounded-full transition hover:brightness-110"
            aria-label={isPlaying ? 'Pause full sequence' : 'Play full sequence'}
            title={isPlaying ? 'Pause sequence' : 'Play full sequence'}
          >
            {isPlaying ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={onPreviousStep}
            disabled={isFirstStep}
            className="control-button text-muted tactical-border flex h-10 w-10 items-center justify-center rounded-full border transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous step"
            title="Previous step"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onNextStep}
            disabled={isLastStep}
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
            aria-label="Reset play"
            title="Reset"
          >
            <RotateCcw size={17} aria-hidden="true" />
          </button>
          <div className="step-copy min-w-0">
            <p className="step-label text-soft font-mono text-[11px] uppercase tracking-[0.12em]">
              Step {activeStepIndex + 1}/{stepCount}
            </p>
            <p className="step-title text-main truncate text-sm font-bold">{activeStep?.title ?? 'Ready'}</p>
          </div>
        </div>
        <div className="bottom-controls-meta text-muted flex items-center justify-between gap-6 font-mono text-xs sm:justify-end">
          <span className="inline-flex items-center gap-2">
            <Gauge size={16} aria-hidden="true" />
            1x
          </span>
          <span className="accent-text">{isPlaying ? 'RUN' : 'HOLD'}</span>
          <span>Q3</span>
        </div>
      </div>

      <div className="play-timeline flex gap-2 overflow-x-auto pb-1" aria-label="Play timeline">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex
          const isComplete = index < activeStepIndex

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepSelect(index)}
              className={[
                'timeline-step min-w-[126px] flex-1 rounded-md border px-3 py-2 text-left transition',
                isActive
                  ? 'tactical-border-strong bg-[var(--accent-muted)]'
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
