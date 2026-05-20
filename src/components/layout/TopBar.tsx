import { Moon, Save, Search, Settings, Share2, Sun } from 'lucide-react'
import type { Theme } from '../../hooks/useTheme'
import type { Play } from '../../types/play'

type TopBarProps = {
  activePlay: Play
  theme: Theme
  onToggleTheme: () => void
}

export function TopBar({ activePlay, theme, onToggleTheme }: TopBarProps) {
  return (
    <header className="topbar panel-glass sticky top-0 z-50 flex h-20 items-center justify-between border-b px-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <h1 className="topbar-brand accent-text shrink-0 font-display text-xl tracking-[0.08em] sm:text-2xl md:text-3xl">
          COURT VISION<span className="hidden sm:inline"> LAB</span>
        </h1>
        <div className="topbar-divider tactical-border hidden h-8 w-px border-l sm:block" />
        <div className="topbar-play min-w-0">
          <p className="topbar-eyebrow text-soft font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">Active Play</p>
          <p className="topbar-play-name text-main truncate text-sm font-bold md:text-base">{activePlay.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="topbar-actions hidden items-center gap-4 lg:flex">
        <label className="panel flex h-12 w-80 items-center gap-3 rounded-md border px-4 text-[var(--text-muted)]">
          <Search size={19} aria-hidden="true" />
          <input
            className="text-main w-full border-0 bg-transparent p-0 font-mono text-sm outline-none placeholder:text-[var(--text-soft)]"
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
              className="text-muted flex h-10 w-10 items-center justify-center rounded-md opacity-70"
              aria-label={label}
              title={label}
            >
              <Icon size={21} aria-hidden="true" />
            </button>
          ))}
        </div>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="panel flex h-10 w-10 items-center justify-center rounded-md border text-[var(--accent)] transition hover:bg-[var(--accent-muted)]"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
