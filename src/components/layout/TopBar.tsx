import { Save, Search, Settings, Share2 } from 'lucide-react'
import type { Play } from '../../types/play'

type TopBarProps = {
  activePlay: Play
}

export function TopBar({ activePlay }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center justify-between border-b border-[#584237]/35 bg-[#1c1b1d]/95 px-4 backdrop-blur-xl md:px-8">
      <div className="flex min-w-0 items-center gap-5">
        <h1 className="font-display text-2xl tracking-[0.08em] text-orange-500 md:text-3xl">COURT VISION</h1>
        <div className="hidden h-8 w-px bg-[#584237]/60 sm:block" />
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e0c0b1]">Active Play</p>
          <p className="truncate text-sm font-bold text-[#e5e1e4] md:text-base">{activePlay.name}</p>
        </div>
      </div>

      <div className="hidden items-center gap-4 lg:flex">
        <label className="flex h-12 w-80 items-center gap-3 rounded-md border border-[#584237]/45 bg-[#2a2a2c] px-4 text-[#e0c0b1]">
          <Search size={19} aria-hidden="true" />
          <input
            className="w-full border-0 bg-transparent p-0 font-mono text-sm text-[#e5e1e4] outline-none placeholder:text-slate-500"
            placeholder="Search plays..."
            disabled
          />
        </label>
        <div className="flex items-center gap-2">
          {[
            { label: 'Save coming soon', icon: Save },
            { label: 'Share coming soon', icon: Share2 },
            { label: 'Settings coming soon', icon: Settings },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              disabled
              className="flex h-10 w-10 items-center justify-center rounded-md text-[#e0c0b1] opacity-70"
              aria-label={label}
              title={label}
            >
              <Icon size={21} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
