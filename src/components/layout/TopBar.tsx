import { Check, Copy, FilePlus2, Moon, RotateCcw, Save, Search, Settings, Share2, Sun, Trash2 } from 'lucide-react'
import type { Theme } from '../../hooks/useTheme'
import type { Play } from '../../types/play'

export type BoardSaveStatus = 'idle' | 'saved' | 'unsaved' | 'autosaved'

type TopBarProps = {
  activePlay: Play
  canClearBoard: boolean
  canDeleteCustomPlay: boolean
  clearBoardLabel: string
  onDeleteCustomPlay: () => void
  onDuplicatePlay: () => void
  onClearBoard: () => void
  onResetToPlayDefaults: () => void
  onSaveAsCustomPlay: () => void
  onSaveBoard: () => void
  playbookMessage?: string
  theme: Theme
  saveStatus?: BoardSaveStatus
  onToggleTheme: () => void
}

export function TopBar({
  activePlay,
  canClearBoard,
  canDeleteCustomPlay,
  clearBoardLabel,
  onClearBoard,
  onDeleteCustomPlay,
  onDuplicatePlay,
  onResetToPlayDefaults,
  onSaveAsCustomPlay,
  onSaveBoard,
  playbookMessage,
  saveStatus = 'idle',
  theme,
  onToggleTheme,
}: TopBarProps) {
  const statusLabel = playbookMessage || {
    idle: '',
    saved: 'Saved',
    unsaved: 'Unsaved changes',
    autosaved: 'Auto-saved',
  }[saveStatus]

  const playbookActions = [
    {
      label: 'Save as custom play',
      icon: FilePlus2,
      onClick: onSaveAsCustomPlay,
      disabled: false,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
    },
    {
      label: 'Duplicate play',
      icon: Copy,
      onClick: onDuplicatePlay,
      disabled: false,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
    },
    {
      label: canDeleteCustomPlay ? 'Delete custom play' : 'Built-in plays cannot be deleted',
      icon: Trash2,
      onClick: onDeleteCustomPlay,
      disabled: !canDeleteCustomPlay,
      className: 'text-[var(--defense)] hover:bg-[var(--accent-muted)]',
    },
  ]

  const boardActions = [
    {
      label: saveStatus === 'saved' || saveStatus === 'autosaved' ? 'Board saved' : 'Save Board',
      icon: saveStatus === 'saved' ? Check : Save,
      onClick: onSaveBoard,
      disabled: false,
      className: saveStatus === 'saved' ? 'accent-text' : 'text-muted hover:bg-[var(--accent-muted)]',
    },
    {
      label: 'Reset to play defaults',
      icon: RotateCcw,
      onClick: onResetToPlayDefaults,
      disabled: false,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
    },
    {
      label: clearBoardLabel,
      icon: Trash2,
      onClick: onClearBoard,
      disabled: !canClearBoard,
      className: 'text-[var(--defense)] hover:bg-[var(--accent-muted)]',
    },
  ]

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
            {statusLabel && (
              <span className="panel rounded-md border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {statusLabel}
              </span>
            )}
            {playbookActions.map(({ className, disabled, icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40',
                  className,
                ].join(' ')}
                aria-label={label}
                title={label}
              >
                <Icon size={21} aria-hidden="true" />
              </button>
            ))}
            <div className="tactical-border h-8 w-px border-l" />
            {boardActions.map(({ className, disabled, icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={[
                  'flex h-10 w-10 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40',
                  className,
                ].join(' ')}
                aria-label={label}
                title={label}
              >
                <Icon size={21} aria-hidden="true" />
              </button>
            ))}
            {[
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
          onClick={onSaveAsCustomPlay}
          className="panel-floating flex h-10 w-10 items-center justify-center rounded-md border text-[var(--accent)] transition hover:bg-[var(--accent-muted)] lg:hidden"
          aria-label="Save as custom play"
          title="Save as custom play"
        >
          <FilePlus2 size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onResetToPlayDefaults}
          className="panel-floating hidden h-10 w-10 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)] sm:flex lg:hidden"
          aria-label="Reset to play defaults"
          title="Reset to play defaults"
        >
          <RotateCcw size={19} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onClearBoard}
          disabled={!canClearBoard}
          className="panel-floating hidden h-10 w-10 items-center justify-center rounded-md border text-[var(--defense)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-40 sm:flex lg:hidden"
          aria-label={clearBoardLabel}
          title={clearBoardLabel}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="panel-floating flex h-10 w-10 items-center justify-center rounded-md border text-[var(--accent)] transition hover:bg-[var(--accent-muted)]"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
