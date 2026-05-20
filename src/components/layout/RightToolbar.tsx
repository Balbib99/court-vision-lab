import { ArrowRight, Eraser, MousePointer2, Pencil, Route, Trash2 } from 'lucide-react'
import type { Player } from '../../types/play'

const mainTools = [
  { label: 'Pass tool coming soon', icon: ArrowRight, active: false },
  { label: 'Movement route coming soon', icon: Route, active: false },
  { label: 'Erase coming soon', icon: Eraser, active: false },
]

type RightToolbarProps = {
  ballCarrierId?: string
  canAddDefense: boolean
  canAddOffense: boolean
  isEditMode: boolean
  onAddDefense: () => void
  onAddOffense: () => void
  onAssignBall: () => void
  onRemoveSelectedPlayer: () => void
  onToggleEditMode: () => void
  selectedPlayer?: Player
}

export function RightToolbar({
  ballCarrierId,
  canAddDefense,
  canAddOffense,
  isEditMode,
  onAddDefense,
  onAddOffense,
  onAssignBall,
  onRemoveSelectedPlayer,
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
  const toolbarButtonClass =
    'toolbar-button flex h-12 w-12 items-center justify-center rounded-md transition disabled:cursor-not-allowed disabled:opacity-40'

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
        >
          {isEditMode ? <MousePointer2 size={21} aria-hidden="true" /> : <Pencil size={21} aria-hidden="true" />}
        </button>

        {mainTools.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            disabled={!active}
            className={[
              toolbarButtonClass,
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
          onClick={onRemoveSelectedPlayer}
          disabled={deleteDisabled}
          className={[
            toolbarButtonClass,
            deleteDisabled ? 'text-[var(--defense)] opacity-50' : 'text-[var(--defense)] hover:bg-[var(--accent-muted)]',
          ].join(' ')}
          aria-label={deleteLabel}
          title={deleteLabel}
        >
          <Trash2 size={21} aria-hidden="true" />
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
        >
          +🏀
        </button>
      </div>
    </div>
  )
}
