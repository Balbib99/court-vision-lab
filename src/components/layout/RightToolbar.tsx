import { ArrowRight, Eraser, Pencil, Plus, Route, Trash2 } from 'lucide-react'

const tools = [
  { label: 'Select tool', icon: Pencil, active: true },
  { label: 'Pass tool coming soon', icon: ArrowRight, active: false },
  { label: 'Movement route coming soon', icon: Route, active: false },
  { label: 'Erase coming soon', icon: Eraser, active: false },
]

export function RightToolbar() {
  return (
    <div className="right-toolbar pointer-events-none absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
      <div className="right-toolbar-tools panel-floating pointer-events-auto flex flex-col gap-2 rounded-lg border p-2">
        {tools.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={[
              'toolbar-button flex h-12 w-12 items-center justify-center rounded-md transition',
              active ? 'accent-bg shadow-[0_0_18px_var(--accent-muted)]' : 'text-muted opacity-75',
            ].join(' ')}
            aria-label={label}
            title={label}
          >
            <Icon size={21} aria-hidden="true" />
          </button>
        ))}
        <div className="tactical-border my-1 h-px w-8 self-center border-t" />
        <button
          type="button"
          disabled
          className="toolbar-button flex h-12 w-12 items-center justify-center rounded-md text-[var(--defense)] opacity-75"
          aria-label="Delete coming soon"
          title="Delete coming soon"
        >
          <Trash2 size={21} aria-hidden="true" />
        </button>
      </div>

      <div className="right-toolbar-spawn panel-floating pointer-events-auto flex flex-col gap-3 rounded-lg border p-2">
        <button type="button" disabled className="spawn-button accent-bg flex h-12 w-12 items-center justify-center rounded-full border-2 border-[color:var(--accent-soft)] font-mono text-xs font-black" aria-label="Add offense coming soon">
          <Plus size={13} aria-hidden="true" />A
        </button>
        <button type="button" disabled className="spawn-button panel flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-xs font-black text-[var(--text-main)]" aria-label="Add defense coming soon">
          <Plus size={13} aria-hidden="true" />D
        </button>
      </div>
    </div>
  )
}
