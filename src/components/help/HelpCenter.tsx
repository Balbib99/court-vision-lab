import { BookOpen, Download, FileJson, Keyboard, LayoutTemplate, MousePointer2, Presentation, Route, Users, X } from 'lucide-react'
import type { GuideTask } from '../../data/guides'

type HelpCenterProps = {
  guides: GuideTask[]
  isOpen: boolean
  onClose: () => void
  onStartGuide: (guideId: string) => void
}

const iconMap = {
  play: BookOpen,
  timeline: Route,
  draw: MousePointer2,
  image: Download,
  json: FileJson,
  coach: Presentation,
  roster: Users,
  keyboard: Keyboard,
  playbook: BookOpen,
  template: LayoutTemplate,
} satisfies Record<GuideTask['icon'], typeof BookOpen>

export function HelpCenter({ guides, isOpen, onClose, onStartGuide }: HelpCenterProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(2,6,23,0.42)] p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="How to use Court Vision Lab">
      <section className="panel-floating max-h-[min(820px,92dvh)] w-full max-w-5xl overflow-y-auto rounded-2xl border p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="accent-text font-mono text-xs font-bold uppercase tracking-[0.16em]">Help Center</p>
            <h2 className="text-main mt-2 font-display text-3xl tracking-[0.05em]">How to use Court Vision Lab</h2>
            <p className="text-muted mt-2 text-sm">What do you want to do? Pick a task and follow a short guided walkthrough.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="panel flex h-10 w-10 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)]"
            aria-label="Close help"
            title="Close help"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => {
            const Icon = iconMap[guide.icon]

            return (
              <article key={guide.id} className="panel rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="accent-bg-soft tactical-border-strong flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-[var(--accent)]">
                    <Icon size={19} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-main text-base font-black">{guide.title}</h3>
                    <p className="text-muted mt-1 text-sm leading-6">{guide.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-soft font-mono text-[10px] font-bold uppercase tracking-[0.12em]">
                    {guide.steps.length} steps
                  </span>
                  <button
                    type="button"
                    onClick={() => onStartGuide(guide.id)}
                    className="accent-badge rounded-md px-3 py-2 text-xs font-bold"
                    aria-label={`Start ${guide.title} guide`}
                    title={`Start ${guide.title} guide`}
                  >
                    Start Guide
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
