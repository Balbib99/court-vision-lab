import { Check } from 'lucide-react'

type StatTicksProps = {
  value: number
  segments?: number
}

export function StatTicks({ segments = 5, value }: StatTicksProps) {
  const filled = Math.min(segments, Math.max(0, Math.round((value / 100) * segments)))

  return (
    <div className="inline-flex items-center gap-1" role="img" aria-label={`${value} out of 100`}>
      {Array.from({ length: segments }).map((_, index) => {
        const isFilled = index < filled

        return (
          <span
            key={index}
            className={[
              'flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border',
              isFilled ? 'border-[color:var(--text-muted)] text-[var(--text-muted)]' : 'border-[color:var(--border)] text-transparent',
            ].join(' ')}
            aria-hidden="true"
          >
            <Check size={9} strokeWidth={2.5} />
          </span>
        )
      })}
    </div>
  )
}
