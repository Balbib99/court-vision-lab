import { motion } from 'framer-motion'
import type { Player, Position } from '../../types/play'
import { toPercent } from '../../utils/positions'

type PlayerMarkerProps = {
  player: Player
  position: Position
  isBallHandler?: boolean
}

export function PlayerMarker({ player, position, isBallHandler = false }: PlayerMarkerProps) {
  const markerStyle = toPercent(position)
  const isOffense = player.team === 'offense'

  return (
    <motion.div
      className="absolute z-30 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 font-mono text-[13px] font-black shadow-[0_14px_22px_rgba(0,0,0,0.45),inset_0_2px_4px_rgba(255,255,255,0.12)] md:h-12 md:w-12 md:text-sm"
      style={markerStyle}
      animate={markerStyle}
      transition={{ type: 'spring', stiffness: 92, damping: 18, mass: 0.85 }}
      title={`${player.label} ${player.role ?? ''}`.trim()}
    >
      <span
        className={[
          'absolute inset-0 rounded-full',
          isOffense
            ? 'border border-orange-100/95 bg-orange-500 text-zinc-950'
            : 'border border-[#a78b7d] bg-[#353437] text-[#e5e1e4]',
          isBallHandler ? 'ring-4 ring-[#ffca45]/30' : '',
        ].join(' ')}
      />
      <span className="relative text-current">{player.label.replace(/[OD]/, '')}</span>
      <span className="sr-only">{player.team}</span>
    </motion.div>
  )
}
