import { Check, Copy, Download, FilePlus2, HelpCircle, ImageDown, LayoutTemplate, MonitorPlay, Moon, Redo2, RotateCcw, Save, ScreenShareOff, Search, Settings, Share2, Sun, Trash2, Undo2, Upload } from 'lucide-react'
import type { Theme } from '../../hooks/useTheme'
import type { Play } from '../../types/play'

export type BoardSaveStatus = 'idle' | 'saved' | 'unsaved' | 'autosaved'
export type ExportStatus = 'idle' | 'exporting' | 'exported' | 'failed'

type TopBarProps = {
  activePlay: Play
  canClearBoard: boolean
  canDeleteCustomPlay: boolean
  clearBoardLabel: string
  exportStatus?: ExportStatus
  isCoachMode: boolean
  canRedo: boolean
  canUndo: boolean
  onDeleteCustomPlay: () => void
  onDuplicatePlay: () => void
  onClearBoard: () => void
  onEnterCoachMode: () => void
  onExitCoachMode: () => void
  onExportPng: () => void
  onExportJson: () => void
  onExportPlaybook: () => void
  onImportJson: () => void
  onOpenHelp: () => void
  onOpenTemplates: () => void
  onRedo: () => void
  onResetToPlayDefaults: () => void
  onSaveAsCustomPlay: () => void
  onSaveBoard: () => void
  onUndo: () => void
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
  exportStatus = 'idle',
  isCoachMode,
  canRedo,
  canUndo,
  onClearBoard,
  onDeleteCustomPlay,
  onDuplicatePlay,
  onEnterCoachMode,
  onExitCoachMode,
  onExportPng,
  onExportJson,
  onExportPlaybook,
  onImportJson,
  onOpenHelp,
  onOpenTemplates,
  onRedo,
  onResetToPlayDefaults,
  onSaveAsCustomPlay,
  onSaveBoard,
  onUndo,
  playbookMessage,
  saveStatus = 'idle',
  theme,
  onToggleTheme,
}: TopBarProps) {
  const exportLabel = {
    idle: '',
    exporting: 'Exporting...',
    exported: 'PNG exported',
    failed: 'Export failed',
  }[exportStatus]
  const statusLabel = exportLabel || playbookMessage || {
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
      className: 'chrome-btn',
      guide: 'save-as-play-button',
    },
    {
      label: 'Duplicate play',
      icon: Copy,
      onClick: onDuplicatePlay,
      disabled: false,
      className: 'chrome-btn',
      guide: 'duplicate-play-button',
    },
    {
      label: canDeleteCustomPlay ? 'Delete custom play' : 'Built-in plays cannot be deleted',
      icon: Trash2,
      onClick: onDeleteCustomPlay,
      disabled: !canDeleteCustomPlay,
      className: 'chrome-btn text-[var(--defense)]',
      guide: 'delete-custom-play-button',
    },
  ]

  const boardActions = [
    {
      label: canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo',
      icon: Undo2,
      onClick: onUndo,
      disabled: !canUndo,
      className: 'chrome-btn',
      guide: 'undo-button',
    },
    {
      label: canRedo ? 'Redo (Ctrl+Y)' : 'Nothing to redo',
      icon: Redo2,
      onClick: onRedo,
      disabled: !canRedo,
      className: 'chrome-btn',
      guide: 'redo-button',
    },
    {
      label: exportStatus === 'exporting' ? 'Exporting PNG' : 'Export PNG',
      icon: ImageDown,
      onClick: onExportPng,
      disabled: exportStatus === 'exporting',
      className: 'chrome-btn',
      guide: 'export-png-button',
    },
    {
      label: isCoachMode ? 'Exit Coach Mode' : 'Coach Mode',
      icon: isCoachMode ? ScreenShareOff : MonitorPlay,
      onClick: isCoachMode ? onExitCoachMode : onEnterCoachMode,
      disabled: false,
      className: isCoachMode ? 'chrome-btn-active' : 'chrome-btn',
      guide: 'coach-mode-button',
    },
    {
      label: saveStatus === 'saved' || saveStatus === 'autosaved' ? 'Board saved' : 'Save Board (Ctrl+S)',
      icon: saveStatus === 'saved' ? Check : Save,
      onClick: onSaveBoard,
      disabled: false,
      className: saveStatus === 'saved' ? 'chrome-btn text-[var(--ball)]' : 'chrome-btn',
      guide: 'save-board-button',
    },
    {
      label: 'Board templates',
      icon: LayoutTemplate,
      onClick: onOpenTemplates,
      disabled: false,
      className: 'chrome-btn',
      guide: 'board-templates-button',
    },
    {
      label: 'Reset to play defaults',
      icon: RotateCcw,
      onClick: onResetToPlayDefaults,
      disabled: false,
      className: 'chrome-btn',
      guide: 'reset-defaults-button',
    },
    {
      label: clearBoardLabel,
      icon: Trash2,
      onClick: onClearBoard,
      disabled: !canClearBoard,
      className: 'chrome-btn text-[var(--defense)]',
      guide: 'clear-board-button',
    },
  ]

  const jsonActions = [
    { label: 'Import JSON', icon: Upload, onClick: onImportJson, guide: 'import-json-button' },
    { label: 'Export JSON', icon: Download, onClick: onExportJson, guide: 'export-json-button' },
    { label: 'Export Playbook', icon: Share2, onClick: onExportPlaybook, guide: 'export-playbook-button' },
    { label: 'How to use', icon: HelpCircle, onClick: onOpenHelp, guide: 'help-button' },
  ]

  return (
    <header className={['topbar chrome-surface sticky top-0 z-50 flex items-center justify-between border-b px-4 md:px-6', isCoachMode ? 'h-14' : 'h-16'].join(' ')}>
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="topbar-brand shrink-0">
          <h1 className="font-display text-lg leading-none text-[var(--text-main)] sm:text-xl md:text-2xl">
            Court Vision<span className="hidden sm:inline"> Lab</span>
          </h1>
          <svg
            className="mt-0.5 h-1.5 w-full text-[var(--text-main)]"
            viewBox="0 0 120 6"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="wordmark-jitter" x="-30%" y="-60%" width="160%" height="220%">
                <feTurbulence type="fractalNoise" baseFrequency="4" numOctaves="2" seed="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <path d="M2 3 C 30 4.5, 70 1.5, 118 3.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" filter="url(#wordmark-jitter)" />
          </svg>
        </div>
        <div className="topbar-divider hidden h-8 w-px border-l border-[color:var(--border)] sm:block" />
        <div className="topbar-play min-w-0">
          <p className="topbar-eyebrow text-soft text-[11px] font-semibold">Active play</p>
          <p className="topbar-play-name text-main truncate text-sm font-bold md:text-base">{activePlay.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className={['topbar-actions hidden items-center gap-4 lg:flex', isCoachMode ? 'lg:gap-2' : ''].join(' ')}>
          {!isCoachMode && (
          <label className="chrome-surface flex h-10 w-64 items-center gap-3 rounded-md border px-3 text-[var(--text-muted)]">
            <Search size={17} aria-hidden="true" />
            <input
              className="text-main w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-[var(--text-soft)]"
              placeholder="Search plays..."
              disabled
            />
          </label>
          )}
          <div className="flex items-center gap-2">
            {statusLabel && (
              <span className="chrome-surface rounded-md border px-3 py-2 text-[11px] font-bold text-[var(--text-muted)]">
                {statusLabel}
              </span>
            )}
            {!isCoachMode && playbookActions.map(({ className, disabled, guide, icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-md transition disabled:cursor-not-allowed',
                  className,
                ].join(' ')}
                aria-label={label}
                title={label}
                data-guide={guide}
              >
                <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
              </button>
            ))}
            {!isCoachMode && <div className="h-8 w-px border-l border-[color:var(--border)]" />}
            {!isCoachMode && jsonActions.map(({ guide, icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="chrome-btn flex h-9 w-9 items-center justify-center rounded-md transition"
                aria-label={label}
                title={label}
                data-guide={guide}
              >
                <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
              </button>
            ))}
            {!isCoachMode && <div className="h-8 w-px border-l border-[color:var(--border)]" />}
            {boardActions.map(({ className, disabled, guide, icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-md transition disabled:cursor-not-allowed',
                  className,
                ].join(' ')}
                aria-label={label}
                title={label}
                data-guide={guide}
              >
                <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
              </button>
            ))}
            {!isCoachMode && [
              { label: 'Share coming soon', icon: Share2 },
              { label: 'Settings coming soon', icon: Settings },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                disabled
                className="chrome-btn flex h-9 w-9 items-center justify-center rounded-md opacity-60"
                aria-label={label}
                title={label}
              >
                <Icon size={19} strokeWidth={1.75} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={onExportPng}
          disabled={exportStatus === 'exporting'}
          className="chrome-surface chrome-btn flex h-10 w-10 items-center justify-center rounded-md border transition disabled:cursor-not-allowed lg:hidden"
          aria-label={exportStatus === 'exporting' ? 'Exporting PNG' : 'Export PNG'}
          title={exportStatus === 'exporting' ? 'Exporting PNG' : 'Export PNG'}
          data-guide="export-png-button"
        >
          <ImageDown size={19} strokeWidth={1.75} aria-hidden="true" />
        </button>
        {!isCoachMode && (
        <button
          type="button"
          onClick={onOpenHelp}
          className="chrome-surface chrome-btn flex h-10 w-10 items-center justify-center rounded-md border transition lg:hidden"
          aria-label="How to use"
          title="How to use"
          data-guide="help-button"
        >
          <HelpCircle size={19} strokeWidth={1.75} aria-hidden="true" />
        </button>
        )}
        <button
          type="button"
          onClick={isCoachMode ? onExitCoachMode : onEnterCoachMode}
          className={['chrome-surface flex h-10 w-10 items-center justify-center rounded-md border transition lg:hidden', isCoachMode ? 'chrome-btn-active' : 'chrome-btn'].join(' ')}
          aria-label={isCoachMode ? 'Exit Coach Mode' : 'Coach Mode'}
          title={isCoachMode ? 'Exit Coach Mode' : 'Coach Mode'}
          data-guide="coach-mode-button"
        >
          {isCoachMode ? <ScreenShareOff size={19} strokeWidth={1.75} aria-hidden="true" /> : <MonitorPlay size={19} strokeWidth={1.75} aria-hidden="true" />}
        </button>
        {!isCoachMode && (
        <button
          type="button"
          onClick={onSaveAsCustomPlay}
          className="chrome-surface chrome-btn flex h-10 w-10 items-center justify-center rounded-md border transition lg:hidden"
          aria-label="Save as custom play"
          title="Save as custom play"
          data-guide="save-as-play-button"
        >
          <FilePlus2 size={19} strokeWidth={1.75} aria-hidden="true" />
        </button>
        )}
        {!isCoachMode && (
        <button
          type="button"
          onClick={onResetToPlayDefaults}
          className="chrome-surface chrome-btn hidden h-10 w-10 items-center justify-center rounded-md border transition sm:flex lg:hidden"
          aria-label="Reset to play defaults"
          title="Reset to play defaults"
        >
          <RotateCcw size={19} strokeWidth={1.75} aria-hidden="true" />
        </button>
        )}
        {!isCoachMode && (
        <button
          type="button"
          onClick={onClearBoard}
          disabled={!canClearBoard}
          className="chrome-surface chrome-btn hidden h-10 w-10 items-center justify-center rounded-md border text-[var(--defense)] transition disabled:cursor-not-allowed sm:flex lg:hidden"
          aria-label={clearBoardLabel}
          title={clearBoardLabel}
        >
          <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
        )}
        <button
          type="button"
          onClick={onToggleTheme}
          className="chrome-surface chrome-btn flex h-10 w-10 items-center justify-center rounded-md border transition"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={19} strokeWidth={1.75} aria-hidden="true" /> : <Moon size={19} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </div>
    </header>
  )
}
