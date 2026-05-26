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
      <section className="panel-floating max-h-[min(760px,90dvh)] w-full max-w-4xl overflow-y-auto rounded-2xl border p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="accent-text font-mono text-xs font-bold uppercase tracking-[0.16em]">Templates</p>
            <h2 className="text-main mt-2 font-display text-3xl tracking-[0.05em]">New Board</h2>
            <p className="text-muted mt-2 text-sm">Load a clean tactical setup and continue in Edit Mode.</p>
          </div>
          <button type="button" onClick={onClose} className="panel flex h-10 w-10 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)]" aria-label="Close templates" title="Close templates">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templates.map((template) => (
            <article key={template.id} className="panel rounded-xl border p-4">
              <h3 className="text-main text-lg font-black">{template.name}</h3>
              <p className="text-muted mt-2 text-sm leading-6">{template.description}</p>
              <p className="accent-text mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em]">{template.suggestedUse}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span key={tag} className="accent-badge rounded-sm px-2 py-1 font-mono text-[10px] font-bold uppercase">{tag}</span>
                ))}
              </div>
              <button type="button" onClick={() => onLoadTemplate(template)} className="accent-badge mt-4 w-full rounded-md px-3 py-2 text-sm font-bold" aria-label={`Load ${template.name}`} title={`Load ${template.name}`}>
                Load Template
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
