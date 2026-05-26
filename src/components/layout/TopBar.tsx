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
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'save-as-play-button',
    },
    {
      label: 'Duplicate play',
      icon: Copy,
      onClick: onDuplicatePlay,
      disabled: false,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'duplicate-play-button',
    },
    {
      label: canDeleteCustomPlay ? 'Delete custom play' : 'Built-in plays cannot be deleted',
      icon: Trash2,
      onClick: onDeleteCustomPlay,
      disabled: !canDeleteCustomPlay,
      className: 'text-[var(--defense)] hover:bg-[var(--accent-muted)]',
      guide: 'delete-custom-play-button',
    },
  ]

  const boardActions = [
    {
      label: canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo',
      icon: Undo2,
      onClick: onUndo,
      disabled: !canUndo,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'undo-button',
    },
    {
      label: canRedo ? 'Redo (Ctrl+Y)' : 'Nothing to redo',
      icon: Redo2,
      onClick: onRedo,
      disabled: !canRedo,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'redo-button',
    },
    {
      label: exportStatus === 'exporting' ? 'Exporting PNG' : 'Export PNG',
      icon: ImageDown,
      onClick: onExportPng,
      disabled: exportStatus === 'exporting',
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'export-png-button',
    },
    {
      label: isCoachMode ? 'Exit Coach Mode' : 'Coach Mode',
      icon: isCoachMode ? ScreenShareOff : MonitorPlay,
      onClick: isCoachMode ? onExitCoachMode : onEnterCoachMode,
      disabled: false,
      className: isCoachMode ? 'accent-text hover:bg-[var(--accent-muted)]' : 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'coach-mode-button',
    },
    {
      label: saveStatus === 'saved' || saveStatus === 'autosaved' ? 'Board saved' : 'Save Board (Ctrl+S)',
      icon: saveStatus === 'saved' ? Check : Save,
      onClick: onSaveBoard,
      disabled: false,
      className: saveStatus === 'saved' ? 'accent-text' : 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'save-board-button',
    },
    {
      label: 'Board templates',
      icon: LayoutTemplate,
      onClick: onOpenTemplates,
      disabled: false,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'board-templates-button',
    },
    {
      label: 'Reset to play defaults',
      icon: RotateCcw,
      onClick: onResetToPlayDefaults,
      disabled: false,
      className: 'text-muted hover:bg-[var(--accent-muted)]',
      guide: 'reset-defaults-button',
    },
    {
      label: clearBoardLabel,
      icon: Trash2,
      onClick: onClearBoard,
      disabled: !canClearBoard,
      className: 'text-[var(--defense)] hover:bg-[var(--accent-muted)]',
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
    <header className={['topbar panel-glass sticky top-0 z-50 flex items-center justify-between border-b px-4 md:px-8', isCoachMode ? 'h-16' : 'h-20'].join(' ')}>
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
        <div className={['topbar-actions hidden items-center gap-4 lg:flex', isCoachMode ? 'lg:gap-2' : ''].join(' ')}>
          {!isCoachMode && (
          <label className="panel flex h-12 w-80 items-center gap-3 rounded-md border px-4 text-[var(--text-muted)]">
            <Search size={19} aria-hidden="true" />
            <input
              className="text-main w-full border-0 bg-transparent p-0 font-mono text-sm outline-none placeholder:text-[var(--text-soft)]"
              placeholder="Search plays..."
              disabled
            />
          </label>
          )}
          <div className="flex items-center gap-2">
            {statusLabel && (
              <span className="panel rounded-md border px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
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
                  'flex h-10 w-10 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40',
                  className,
                ].join(' ')}
                aria-label={label}
                title={label}
                data-guide={guide}
              >
                <Icon size={21} aria-hidden="true" />
              </button>
            ))}
            {!isCoachMode && <div className="tactical-border h-8 w-px border-l" />}
            {!isCoachMode && jsonActions.map(({ guide, icon: Icon, label, onClick }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="text-muted flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-[var(--accent-muted)]"
                aria-label={label}
                title={label}
                data-guide={guide}
              >
                <Icon size={21} aria-hidden="true" />
              </button>
            ))}
            {!isCoachMode && <div className="tactical-border h-8 w-px border-l" />}
            {boardActions.map(({ className, disabled, guide, icon: Icon, label, onClick }) => (
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
                data-guide={guide}
              >
                <Icon size={21} aria-hidden="true" />
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
          onClick={onExportPng}
          disabled={exportStatus === 'exporting'}
          className="panel-floating flex h-10 w-10 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)] disabled:cursor-not-allowed disabled:opacity-40 lg:hidden"
          aria-label={exportStatus === 'exporting' ? 'Exporting PNG' : 'Export PNG'}
          title={exportStatus === 'exporting' ? 'Exporting PNG' : 'Export PNG'}
          data-guide="export-png-button"
        >
          <ImageDown size={19} aria-hidden="true" />
        </button>
        {!isCoachMode && (
        <button
          type="button"
          onClick={onOpenHelp}
          className="panel-floating flex h-10 w-10 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)] lg:hidden"
          aria-label="How to use"
          title="How to use"
          data-guide="help-button"
        >
          <HelpCircle size={19} aria-hidden="true" />
        </button>
        )}
        <button
          type="button"
          onClick={isCoachMode ? onExitCoachMode : onEnterCoachMode}
          className="panel-floating flex h-10 w-10 items-center justify-center rounded-md border text-[var(--accent)] transition hover:bg-[var(--accent-muted)] lg:hidden"
          aria-label={isCoachMode ? 'Exit Coach Mode' : 'Coach Mode'}
          title={isCoachMode ? 'Exit Coach Mode' : 'Coach Mode'}
          data-guide="coach-mode-button"
        >
          {isCoachMode ? <ScreenShareOff size={19} aria-hidden="true" /> : <MonitorPlay size={19} aria-hidden="true" />}
        </button>
        {!isCoachMode && (
        <button
          type="button"
          onClick={onSaveAsCustomPlay}
          className="panel-floating flex h-10 w-10 items-center justify-center rounded-md border text-[var(--accent)] transition hover:bg-[var(--accent-muted)] lg:hidden"
          aria-label="Save as custom play"
          title="Save as custom play"
          data-guide="save-as-play-button"
        >
          <FilePlus2 size={19} aria-hidden="true" />
        </button>
        )}
        {!isCoachMode && (
        <button
          type="button"
          onClick={onResetToPlayDefaults}
          className="panel-floating hidden h-10 w-10 items-center justify-center rounded-md border text-[var(--text-muted)] transition hover:bg-[var(--accent-muted)] sm:flex lg:hidden"
          aria-label="Reset to play defaults"
          title="Reset to play defaults"
        >
          <RotateCcw size={19} aria-hidden="true" />
        </button>
        )}
        {!isCoachMode && (
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
        )}
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
