import { useEffect, useMemo, useState } from 'react'
import type { GuideSection, GuideTask } from '../../data/guides'

type GuidedTourProps = {
  currentStepIndex: number
  guide?: GuideTask
  onBack: () => void
  onClose: () => void
  onNext: () => void
  onSectionChange: (section: GuideSection) => void
}

type HighlightRect = {
  height: number
  left: number
  top: number
  width: number
}

export function GuidedTour({ currentStepIndex, guide, onBack, onClose, onNext, onSectionChange }: GuidedTourProps) {
  const [rect, setRect] = useState<HighlightRect>()
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

  const cardStyle = useMemo(() => {
    if (!rect || step?.placement === 'center') {
      return {
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const cardWidth = Math.min(380, viewportWidth - 32)
    const left = Math.min(Math.max(16, rect.left + rect.width + 18), viewportWidth - cardWidth - 16)
    const top = Math.min(Math.max(16, rect.top), viewportHeight - 260)

    if (step?.placement === 'left') {
      return { left: Math.max(16, rect.left - cardWidth - 18), top }
    }

    if (step?.placement === 'top') {
      return { left: Math.min(Math.max(16, rect.left), viewportWidth - cardWidth - 16), top: Math.max(16, rect.top - 244) }
    }

    if (step?.placement === 'bottom') {
      return { left: Math.min(Math.max(16, rect.left), viewportWidth - cardWidth - 16), top: Math.min(viewportHeight - 260, rect.top + rect.height + 18) }
    }

    return { left, top }
  }, [rect, step?.placement])

  if (!guide || !step) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none">
      <div className="absolute inset-0 bg-[rgba(2,6,23,0.36)] backdrop-blur-[2px]" />
      {rect && (
        <div
          className="tour-highlight pointer-events-none fixed rounded-xl border-2 border-[var(--accent)] shadow-[0_0_0_9999px_rgba(2,6,23,0.18),0_0_28px_var(--accent-muted)]"
          style={{
            height: rect.height + 14,
            left: rect.left - 7,
            top: rect.top - 7,
            width: rect.width + 14,
          }}
        />
      )}
      <section className="panel-floating pointer-events-auto fixed w-[min(380px,calc(100vw-32px))] rounded-2xl border p-4" style={cardStyle}>
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
