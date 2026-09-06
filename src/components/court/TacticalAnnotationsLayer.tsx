import { AnimatePresence } from 'framer-motion'
import type { Position, TacticalAnnotation as TacticalAnnotationType } from '../../types/play'
import { COURT_HEIGHT, COURT_WIDTH } from '../../utils/positions'
import { TacticalAnnotation } from './TacticalAnnotation'

type TacticalAnnotationsLayerProps = {
  annotations?: TacticalAnnotationType[]
  eraseEnabled?: boolean
  onEraseAnnotation?: (annotationId: string) => void
  preview?: {
    from: Position
    to: Position
    type: 'movement' | 'pass'
  }
}

export function TacticalAnnotationsLayer({
  annotations = [],
  eraseEnabled = false,
  onEraseAnnotation,
  preview,
}: TacticalAnnotationsLayerProps) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker id="manual-movement-arrow" markerWidth="4" markerHeight="4" refX="3.2" refY="2" orient="auto">
          <path d="M 0 0 L 4 2 L 0 4 z" fill="var(--offense)" />
        </marker>
        <marker id="manual-pass-arrow" markerWidth="4" markerHeight="4" refX="3.2" refY="2" orient="auto">
          <path d="M 0 0 L 4 2 L 0 4 z" fill="var(--ball)" />
        </marker>
      </defs>
      <g className={eraseEnabled ? 'pointer-events-auto' : 'pointer-events-none'}>
        <AnimatePresence>
          {annotations.map((annotation) => (
            <TacticalAnnotation
              key={annotation.id}
              annotation={annotation}
              isEditable={eraseEnabled}
              onErase={onEraseAnnotation}
            />
          ))}
        </AnimatePresence>
      </g>
      {preview && (
        <line
          x1={preview.from.x}
          y1={preview.from.y}
          x2={preview.to.x}
          y2={preview.to.y}
          stroke={preview.type === 'pass' ? 'var(--ball)' : 'var(--offense)'}
          strokeWidth="0.45"
          strokeDasharray={preview.type === 'pass' ? '1.4 1.3' : undefined}
          strokeLinecap="round"
          markerEnd={preview.type === 'pass' ? 'url(#manual-pass-arrow)' : 'url(#manual-movement-arrow)'}
          filter="url(#ink-jitter)"
          opacity="0.72"
        />
      )}
    </svg>
  )
}
