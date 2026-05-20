import { motion } from 'framer-motion'
import type { Position } from '../../types/play'
import { toPercent } from '../../utils/positions'

type BallMarkerProps = {
  position: Position
}

export function BallMarker({ position }: BallMarkerProps) {
  const markerStyle = toPercent({ x: position.x - 3.7, y: position.y + 3.4 })

  return (
    <motion.div
      className="absolute z-40 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffdf9a] bg-[#e4ae00] shadow-[0_0_18px_rgba(249,115,22,0.4),inset_0_2px_3px_rgba(255,255,255,0.25)] sm:h-5 sm:w-5 md:h-6 md:w-6"
      style={markerStyle}
      animate={markerStyle}
      transition={{ type: 'spring', stiffness: 120, damping: 17 }}
      aria-label="Ball"
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 rotate-12 bg-[#783200]/55" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-12 bg-[#783200]/55" />
      <span className="absolute inset-[4px] rounded-full border border-[#783200]/35" />
    </motion.div>
  )
}
