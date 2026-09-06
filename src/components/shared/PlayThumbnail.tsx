import { useId } from 'react'
import type { Player } from '../../types/play'
import { COURT_HEIGHT, COURT_WIDTH } from '../../utils/positions'

type PlayThumbnailProps = {
  players: Player[]
}

export function PlayThumbnail({ players }: PlayThumbnailProps) {
  const filterId = useId()

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-[color:var(--court-frame)] bg-[var(--court-bg)]">
      <svg viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`} className="h-full w-full" role="img" aria-label="Play formation preview">
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="6" numOctaves="2" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.45" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`} stroke="var(--court-line)" strokeOpacity="0.55" strokeWidth="0.4" fill="none">
          <rect x="0.5" y="0.5" width="99" height="55.25" />
          <line x1="50" y1="0.5" x2="50" y2="55.75" />
          <circle cx="50" cy="28.125" r="8.6" />
          <rect x="0.5" y="17.1" width="19.5" height="22.05" />
          <rect x="80" y="17.1" width="19.5" height="22.05" />
        </g>
        {players.map((player) => (
          <circle
            key={player.id}
            cx={player.position.x}
            cy={player.position.y}
            r={player.hasBall ? 2.4 : 2.1}
            fill={player.team === 'offense' ? 'var(--offense)' : 'var(--defense)'}
            stroke={player.hasBall ? 'var(--ball)' : 'none'}
            strokeWidth={player.hasBall ? 0.6 : 0}
          />
        ))}
      </svg>
    </div>
  )
}
