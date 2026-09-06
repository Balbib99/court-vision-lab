import { X } from 'lucide-react'
import type { BoardTemplate } from '../../data/boardTemplates'

type TemplatesModalProps = {
  isOpen: boolean
  onClose: () => void
  onLoadTemplate: (template: BoardTemplate) => void
  templates: BoardTemplate[]
}

export function TemplatesModal({ isOpen, onClose, onLoadTemplate, templates }: TemplatesModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(2,6,23,0.42)] p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Board templates">
      <section className="chrome-surface max-h-[min(760px,90dvh)] w-full max-w-4xl overflow-y-auto rounded-2xl border p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-main font-display text-3xl">New board</h2>
            <p className="text-muted mt-2 text-sm">Load a clean tactical setup and continue in Edit Mode.</p>
          </div>
          <button type="button" onClick={onClose} className="chrome-surface chrome-btn flex h-10 w-10 items-center justify-center rounded-md border transition" aria-label="Close templates" title="Close templates">
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="border border-[color:var(--border)] rounded-xl p-4">
              <h3 className="text-main text-lg font-black">{template.name}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{template.description}</p>
              <p className="text-soft mt-3 text-[11px] font-semibold">{template.suggestedUse}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="chrome-surface rounded-sm border px-2 py-1 text-[10px] font-bold text-[var(--text-muted)]">{tag}</span>
                ))}
              </div>
              <button type="button" onClick={() => onLoadTemplate(template)} className="chrome-btn-primary mt-4 w-full rounded-md px-3 py-2 text-sm font-bold" aria-label={`Load ${template.name}`} title={`Load ${template.name}`}>
                Load template
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
