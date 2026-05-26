import { ArrowUpRight, CircleArrowRight, CirclePlay, Eraser, MousePointer2, Pencil, Shield, Trash2 } from 'lucide-react'
import type { DrawingTool, Player } from '../../types/play'

type RightToolbarProps = {
  activeTool: DrawingTool
  ballCarrierId?: string
  canAddDefense: boolean
  canAddOffense: boolean
  canUseDrawingTools: boolean
  isEditMode: boolean
  onAddDefense: () => void
  onAddOffense: () => void
  onAssignBall: () => void
  onRemoveSelectedPlayer: () => void
  onSelectTool: (tool: DrawingTool) => void
  onToggleEditMode: () => void
  selectedPlayer?: Player
}

export function RightToolbar({
  activeTool,
  ballCarrierId,
  canAddDefense,
  canAddOffense,
  canUseDrawingTools,
  isEditMode,
  onAddDefense,
  onAddOffense,
  onAssignBall,
  onRemoveSelectedPlayer,
  onSelectTool,
  onToggleEditMode,
  selectedPlayer,
}: RightToolbarProps) {
  const selectedPlayerHasBall = Boolean(selectedPlayer && selectedPlayer.id === ballCarrierId)
  const assignBallLabel = !selectedPlayer
    ? 'Select a player first'
    : selectedPlayerHasBall
      ? 'Selected player has ball'
      : 'Assign ball to selected player'
  const ballButtonDisabled = !isEditMode || !selectedPlayer || selectedPlayerHasBall
  const deleteLabel = !isEditMode
    ? 'Available in Edit Mode'
    : selectedPlayer
      ? 'Remove selected player'
      : 'Select a player first'
  const deleteDisabled = !isEditMode || !selectedPlayer
  const toolbarButtonClass =
    'toolbar-button flex h-10 w-10 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40'

  const drawingTools: Array<{ label: string; tool: Exclude<DrawingTool, 'select'>; icon: typeof MousePointer2 }> = [
    { label: 'Draw movement arrow', tool: 'movement', icon: ArrowUpRight },
    { label: 'Draw pass line', tool: 'pass', icon: CircleArrowRight },
    { label: 'Place screen marker', tool: 'screen', icon: Shield },
    { label: 'Erase annotation', tool: 'erase', icon: Eraser },
  ]

  const creationTools = [
    {
      disabled: !isEditMode || !canAddOffense,
      label: !isEditMode
        ? 'Available in Edit Mode'
        : canAddOffense
          ? 'Add offensive player'
          : 'Maximum 5 offensive players reached',
      onClick: onAddOffense,
      text: '+O',
    },
    {
      disabled: !isEditMode || !canAddDefense,
      label: !isEditMode
        ? 'Available in Edit Mode'
        : canAddDefense
          ? 'Add defensive player'
          : 'Maximum 5 defensive players reached',
      onClick: onAddDefense,
      text: '+D',
    },
  ]

  return (
    <div className="right-toolbar pointer-events-none absolute right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
      <div className="right-toolbar-tools panel-floating pointer-events-auto flex flex-col items-center gap-2 rounded-lg border p-2">
        <button
          type="button"
          onClick={onToggleEditMode}
          className={[
            toolbarButtonClass,
            isEditMode ? 'accent-bg shadow-[0_0_18px_var(--accent-muted)]' : 'text-muted hover:bg-[var(--accent-muted)]',
          ].join(' ')}
          aria-label={isEditMode ? 'Switch to play mode' : 'Switch to edit mode'}
          title={isEditMode ? 'Play Mode' : 'Edit Mode'}
          data-guide="edit-mode-toggle"
        >
          {isEditMode ? <CirclePlay size={19} aria-hidden="true" /> : <Pencil size={19} aria-hidden="true" />}
        </button>

        {drawingTools.map(({ icon: Icon, label, tool }) => {
          const disabled = !isEditMode || !canUseDrawingTools
          const title = !isEditMode
            ? 'Available in Edit Mode'
            : disabled
              ? 'Duplicate this play to edit annotations'
              : label
          const isActive = activeTool === tool

          return (
            <button
              key={tool}
              type="button"
              onClick={() => onSelectTool(tool)}
              disabled={disabled}
              className={[
                toolbarButtonClass,
                isActive ? 'accent-bg shadow-[0_0_18px_var(--accent-muted)]' : 'text-muted hover:bg-[var(--accent-muted)]',
              ].join(' ')}
              aria-label={title}
              title={title}
              data-guide={`${tool}-tool`}
            >
              <Icon size={19} aria-hidden="true" />
            </button>
          )
        })}

        <div className="tactical-border my-1 h-px w-8 self-center border-t" />

        <button
          type="button"
          onClick={onRemoveSelectedPlayer}
          disabled={deleteDisabled}
          className={[
            toolbarButtonClass,
            deleteDisabled ? 'text-[var(--defense)] opacity-50' : 'text-[var(--defense)] hover:bg-[var(--accent-muted)]',
          ].join(' ')}
          aria-label={deleteLabel}
          title={deleteLabel}
          data-guide="delete-player-button"
        >
          <Trash2 size={19} aria-hidden="true" />
        </button>

        <div className="tactical-border my-1 h-px w-8 self-center border-t" />

        {creationTools.map((tool) => (
          <button
            key={tool.text}
            type="button"
            onClick={tool.onClick}
            disabled={tool.disabled}
            className={[toolbarButtonClass, 'panel border-2 font-mono text-xs font-black text-[var(--text-main)]'].join(' ')}
            aria-label={tool.label}
            title={tool.label}
            data-guide={tool.text === '+O' ? 'add-offense-button' : 'add-defense-button'}
          >
            {tool.text}
          </button>
        ))}

        <div className="tactical-border my-1 h-px w-8 self-center border-t" />

        <button
          type="button"
          onClick={onAssignBall}
          disabled={ballButtonDisabled}
          className={[
            toolbarButtonClass,
            'border-2 font-mono text-[15px] font-black',
            selectedPlayerHasBall
              ? 'accent-bg border-[color:var(--accent-soft)] shadow-[0_0_18px_var(--accent-muted)]'
              : 'accent-badge',
          ].join(' ')}
          aria-label={assignBallLabel}
          title={assignBallLabel}
          data-guide="assign-ball-button"
        >
          <span aria-hidden="true">+{String.fromCodePoint(0x1f3c0)}</span>
        </button>
      </div>
    </div>
  )
}
