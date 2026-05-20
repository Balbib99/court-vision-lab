import type { Play, PlayStep } from '../../types/play'
import { PlaySelector } from './PlaySelector'

type PlayDetailsPanelProps = {
  activeStep?: PlayStep
  activeStepIndex: number
  onSelectPlay: (playId: string) => void
  play: Play
  plays: Play[]
}

export function PlayDetailsPanel({
  activeStep,
  activeStepIndex,
  onSelectPlay,
  play,
  plays,
}: PlayDetailsPanelProps) {
  return (
    <aside className="play-details-panel w-full border-t border-[#584237]/35 bg-[#1c1b1d]/95 p-4 pb-8 backdrop-blur-xl xl:absolute xl:left-6 xl:top-6 xl:z-30 xl:w-[340px] xl:border xl:pb-4 xl:shadow-[0_22px_50px_rgba(0,0,0,0.45)]">
      <div className="play-details-selector">
        <PlaySelector plays={plays} selectedPlayId={play.id} onSelect={onSelectPlay} />
      </div>

      <div className="play-details-header mt-5 border-t border-[#584237]/35 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange-400">{play.category}</p>
            <h2 className="mt-1 font-display text-2xl tracking-[0.05em] text-[#e5e1e4]">{play.name}</h2>
          </div>
          <span className="rounded-sm border border-orange-500/45 bg-orange-500/10 px-2 py-1 font-mono text-[11px] font-bold text-orange-300">
            {play.difficulty}
          </span>
        </div>
        <p className="play-description mt-4 text-sm leading-6 text-[#ccc5c1]">{play.description}</p>
      </div>

      <div className="play-objective mt-5 border-t border-[#584237]/35 pt-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#e0c0b1]">Objective</h3>
        <p className="mt-2 text-sm leading-6 text-[#ccc5c1]">{play.objective}</p>
      </div>

      <div className="current-read mt-5 border-t border-[#584237]/35 pt-5">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#e0c0b1]">Current read</h3>
        <p className="mt-2 text-sm font-bold text-[#e5e1e4]">{activeStep?.title}</p>
        <p className="current-read-description mt-1 text-sm leading-6 text-[#ccc5c1]">{activeStep?.description}</p>
      </div>

      <ol className="play-steps mt-5 grid gap-2 border-t border-[#584237]/35 pt-5">
        {play.steps.map((step, index) => {
          const isActive = index === activeStepIndex
          const isDone = index < activeStepIndex

          return (
            <li
              key={step.id}
              className={[
                'border px-3 py-2 text-sm',
                isActive
                  ? 'border-orange-500/60 bg-orange-500/10'
                  : isDone
                    ? 'border-[#584237]/45 bg-[#2a2a2c]'
                    : 'border-[#584237]/25 bg-[#131315]',
              ].join(' ')}
            >
              <span className="font-mono text-[11px] text-orange-300">{String(index + 1).padStart(2, '0')}</span>
              <span className="ml-3 font-semibold text-[#e5e1e4]">{step.title}</span>
            </li>
          )
        })}
      </ol>

      <div className="play-concepts mt-5 flex flex-wrap gap-2">
        {play.concepts.map((concept) => (
          <span key={concept} className="border-l-2 border-orange-500 bg-[#131315] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-[#e0c0b1]">
            {concept}
          </span>
        ))}
      </div>
    </aside>
  )
}
