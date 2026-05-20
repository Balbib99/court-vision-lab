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
      <div className="right-toolbar-tools pointer-events-auto flex flex-col gap-2 rounded-lg border border-[#584237]/35 bg-[#2a2a2c]/80 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {tools.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={[
              'toolbar-button flex h-12 w-12 items-center justify-center rounded-md transition',
              active ? 'bg-orange-500 text-[#341100] shadow-[0_0_18px_rgba(249,115,22,0.32)]' : 'text-[#e0c0b1] opacity-75',
            ].join(' ')}
            aria-label={label}
            title={label}
          >
            <Icon size={21} aria-hidden="true" />
          </button>
        ))}
        <div className="my-1 h-px w-8 self-center bg-[#584237]/50" />
        <button
          type="button"
          disabled
          className="toolbar-button flex h-12 w-12 items-center justify-center rounded-md text-red-200 opacity-75"
          aria-label="Delete coming soon"
          title="Delete coming soon"
        >
          <Trash2 size={21} aria-hidden="true" />
        </button>
      </div>

      <div className="right-toolbar-spawn pointer-events-auto flex flex-col gap-3 rounded-lg border border-[#584237]/35 bg-[#2a2a2c]/80 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <button type="button" disabled className="spawn-button flex h-12 w-12 items-center justify-center rounded-full border-2 border-orange-100 bg-orange-500 font-mono text-xs font-black text-[#341100]" aria-label="Add offense coming soon">
          <Plus size={13} aria-hidden="true" />A
        </button>
        <button type="button" disabled className="spawn-button flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#a78b7d] bg-[#353437] font-mono text-xs font-black text-[#e5e1e4]" aria-label="Add defense coming soon">
          <Plus size={13} aria-hidden="true" />D
        </button>
      </div>
    </div>
  )
}
