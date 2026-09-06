import { motion } from 'framer-motion'
import type { TacticalAnnotation as TacticalAnnotationType } from '../../types/play'

type TacticalAnnotationProps = {
  annotation: TacticalAnnotationType
  isEditable?: boolean
  onErase?: (annotationId: string) => void
}

const eraseTransition = { duration: 0.5, ease: 'easeIn' as const }

export function TacticalAnnotation({ annotation, isEditable = false, onErase }: TacticalAnnotationProps) {
  const handlePointerDown = () => {
    if (isEditable) {
      onErase?.(annotation.id)
    }
  }

  if (annotation.type === 'screen' && annotation.position) {
    return (
      <motion.g
        className={isEditable ? 'cursor-pointer' : undefined}
        onPointerDown={handlePointerDown}
        role={isEditable ? 'button' : undefined}
        aria-label={isEditable ? 'Erase screen annotation' : undefined}
        filter="url(#ink-jitter)"
        exit={{ opacity: 0 }}
        transition={eraseTransition}
      >
        <circle
          cx={annotation.position.x}
          cy={annotation.position.y}
          r="1.9"
          fill="color-mix(in srgb, var(--text-main) 12%, transparent)"
          stroke="var(--text-main)"
          strokeWidth="0.45"
        />
        <path
          d={`M ${annotation.position.x - 2.4} ${annotation.position.y - 1.8} L ${annotation.position.x + 2.4} ${annotation.position.y - 1.8} M ${annotation.position.x} ${annotation.position.y - 1.8} L ${annotation.position.x} ${annotation.position.y + 2.3}`}
          fill="none"
          stroke="var(--text-main)"
          strokeLinecap="round"
          strokeWidth="0.55"
        />
      </motion.g>
    )
  }

  if (!annotation.from || !annotation.to) {
    return null
  }

  const markerEnd = annotation.type === 'pass' ? 'url(#manual-pass-arrow)' : 'url(#manual-movement-arrow)'
  const stroke = annotation.type === 'pass' ? 'var(--ball)' : 'var(--offense)'

  return (
    <motion.line
      className={isEditable ? 'cursor-pointer' : undefined}
      x1={annotation.from.x}
      y1={annotation.from.y}
      x2={annotation.to.x}
      y2={annotation.to.y}
      stroke={annotation.color ?? stroke}
      strokeWidth="0.5"
      strokeDasharray={annotation.type === 'pass' ? '1.4 1.3' : undefined}
      strokeLinecap="round"
      markerEnd={markerEnd}
      opacity="0.9"
      filter="url(#ink-jitter)"
      exit={{ opacity: 0 }}
      transition={eraseTransition}
      onPointerDown={handlePointerDown}
      role={isEditable ? 'button' : undefined}
      aria-label={isEditable ? `Erase ${annotation.type} annotation` : undefined}
    />
  )
}
