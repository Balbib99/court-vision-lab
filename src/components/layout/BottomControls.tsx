import { Gauge, Pause, Play, RotateCcw } from 'lucide-react'
import type { PlayStep } from '../../types/play'

type BottomControlsProps = {
  activeStep?: PlayStep
  activeStepIndex: number
  isPlaying: boolean
  onPlay: () => void
  onReset: () => void
  stepCount: number
}

export function BottomControls({
  activeStep,
  activeStepIndex,
  isPlaying,
  onPlay,
  onReset,
  stepCount,
}: BottomControlsProps) {
  return (
    <div className="z-30 mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-full border border-[#584237]/40 bg-[#201f22]/95 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:px-7">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-[#341100] transition hover:bg-[#ffb690]"
          aria-label={isPlaying ? 'Pause play' : 'Play animation'}
        >
          {isPlaying ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#584237]/60 text-[#e0c0b1] transition hover:bg-[#353437]"
          aria-label="Reset play"
          title="Reset"
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#e0c0b1]">
            Step {activeStepIndex + 1}/{stepCount}
          </p>
          <p className="text-sm font-bold text-[#e5e1e4]">{activeStep?.title ?? 'Ready'}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-6 font-mono text-xs text-[#e0c0b1] sm:justify-end">
        <span className="inline-flex items-center gap-2">
          <Gauge size={16} aria-hidden="true" />
          1x
        </span>
        <span className="text-orange-500">08:42</span>
        <span>Q3</span>
      </div>
    </div>
  )
}
