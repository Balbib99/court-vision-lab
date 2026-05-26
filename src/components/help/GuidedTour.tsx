import { useEffect, useMemo, useState } from 'react'
import type { GuideSection, GuideTask } from '../../data/guides'
import { getBestTourCardPosition, getSpotlightOverlayPieces, getSpotlightRect } from '../../utils/tourPosition'
import type { TourRect } from '../../utils/tourPosition'

type GuidedTourProps = {
  currentStepIndex: number
  guide?: GuideTask
  onBack: () => void
  onClose: () => void
  onNext: () => void
  onSectionChange: (section: GuideSection) => void
}

export function GuidedTour({ currentStepIndex, guide, onBack, onClose, onNext, onSectionChange }: GuidedTourProps) {
  const [rect, setRect] = useState<TourRect>()
  const [viewport, setViewport] = useState(() => ({
    height: window.innerHeight,
    width: window.innerWidth,
  }))
  const step = guide?.steps[currentStepIndex]
  const isLastStep = Boolean(guide && currentStepIndex === guide.steps.length - 1)

  useEffect(() => {
    if (!step?.requiredSection) {
      return
    }

    onSectionChange(step.requiredSection)
  }, [onSectionChange, step?.requiredSection])

  useEffect(() => {
    if (!step) {
      return
    }

    if (!step.target) {
      const timer = window.setTimeout(() => setRect(undefined), 0)
      return () => window.clearTimeout(timer)
    }

    const updateRect = () => {
      setViewport({ height: window.innerHeight, width: window.innerWidth })
      const element = document.querySelector(step.target ?? '')
      if (!(element instanceof HTMLElement)) {
        setRect(undefined)
        return
      }

      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      window.setTimeout(() => {
        const bounds = element.getBoundingClientRect()
        setRect({
          height: bounds.height,
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
        })
      }, 180)
    }

    const timer = window.setTimeout(updateRect, 240)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [step])

  const spotlightRect = useMemo(
    () => rect ? getSpotlightRect(rect, viewport, 12) : undefined,
    [rect, viewport],
  )
  const overlayPieces = useMemo(
    () => spotlightRect ? getSpotlightOverlayPieces(spotlightRect, viewport) : undefined,
    [spotlightRect, viewport],
  )
  const cardPosition = useMemo(
    () => getBestTourCardPosition(spotlightRect, step?.placement, viewport),
    [spotlightRect, step?.placement, viewport],
  )

  if (!guide || !step) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      {overlayPieces ? (
        overlayPieces.map((piece, index) => (
          <div
            key={`${piece.left}-${piece.top}-${index}`}
            className="tour-overlay-piece pointer-events-none fixed"
            style={{
              height: piece.height,
              left: piece.left,
              top: piece.top,
              width: piece.width,
            }}
          />
        ))
      ) : (
        <div className="tour-overlay-piece pointer-events-none absolute inset-0" />
      )}
      {spotlightRect && (
        <div
          className="tour-highlight pointer-events-none fixed rounded-xl border-2 border-[var(--accent)]"
          style={{
            height: spotlightRect.height,
            left: spotlightRect.left,
            top: spotlightRect.top,
            width: spotlightRect.width,
          }}
        />
      )}
      <section
        className="panel-floating pointer-events-auto fixed w-[min(380px,calc(100vw-32px))] rounded-2xl border p-4"
        style={{
          left: cardPosition.left,
          top: cardPosition.top,
          transform: cardPosition.transform,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="accent-text font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
              Step {currentStepIndex + 1} / {guide.steps.length}
            </p>
            <h3 className="text-main mt-1 text-lg font-black">{step.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted rounded-md px-2 py-1 text-sm transition hover:bg-[var(--accent-muted)]"
            aria-label="Exit guide"
            title="Exit guide"
          >
            Exit
          </button>
        </div>
        <p className="text-muted mt-3 text-sm leading-6">{step.description}</p>
        {step.actionHint && (
          <p className="accent-text mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">{step.actionHint}</p>
        )}
        {!rect && step.target && (
          <p className="text-soft mt-3 text-xs">This target is not visible right now, so the guide is showing this step without a highlight.</p>
        )}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={currentStepIndex === 0}
            className="panel rounded-md border px-3 py-2 text-xs font-bold text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous guide step"
            title="Previous guide step"
          >
            Back
          </button>
          <button
            type="button"
            onClick={isLastStep ? onClose : onNext}
            className="accent-badge rounded-md px-3 py-2 text-xs font-bold"
            aria-label={isLastStep ? 'Finish guide' : 'Next guide step'}
            title={isLastStep ? 'Finish guide' : 'Next guide step'}
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </section>
    </div>
  )
}
