import { motion } from 'framer-motion'
import type { PointerEvent } from 'react'
import type { Player, Position } from '../../types/play'
import { toPercent } from '../../utils/positions'

type PlayerMarkerProps = {
  player: Player
  position: Position
  isEditable?: boolean
  isBallHandler?: boolean
  isSelected?: boolean
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>) => void
}

export function PlayerMarker({
  player,
  position,
  isBallHandler = false,
  isEditable = false,
  isSelected = false,
  onPointerDown,
}: PlayerMarkerProps) {
  const markerStyle = toPercent(position)
  const isOffense = player.team === 'offense'

  return (
    <motion.button
      type="button"
      className={[
        'absolute z-30 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-[11px] font-black shadow-[0_14px_22px_rgba(0,0,0,0.28),inset_0_2px_4px_rgba(255,255,255,0.12)] sm:h-10 sm:w-10 sm:text-xs md:h-12 md:w-12 md:text-sm',
        isOffense ? 'text-[var(--offense-text)]' : 'text-[var(--defense-text)]',
        isEditable ? 'cursor-grab touch-none active:cursor-grabbing' : 'cursor-default',
      ].join(' ')}
      style={markerStyle}
      animate={markerStyle}
      transition={{ type: 'spring', stiffness: 92, damping: 18, mass: 0.85 }}
      title={`${player.label}${player.name ? ` - ${player.name}` : ''} ${player.role ?? ''}`.trim()}
      aria-label={`${isEditable ? 'Select and drag' : 'Player'} ${player.label}${player.name ? `, ${player.name}` : ''}, ${player.team}`}
      onPointerDown={onPointerDown}
    >
      <span
        className={[
          'absolute inset-0 rounded-full border',
          isOffense
            ? 'border-[color:var(--offense)] bg-[var(--offense)] text-[var(--offense-text)]'
            : 'border-[color:var(--defense)] bg-[var(--defense)] text-[var(--defense-text)]',
          isBallHandler ? 'ring-4 ring-[color:var(--accent-muted)]' : '',
          isSelected ? 'ring-4 ring-[color:var(--accent-soft)] brightness-110' : '',
        ].join(' ')}
      />
      <span className="relative text-current">{player.label.replace(/[OD]/, '')}</span>
      <span className="sr-only">{player.team}</span>
    </motion.button>
  )
}
