import { useId } from 'react'

export type MiniCourtPlayer = {
  id: string
  label: string
  position: string
  value: number
  emphasized?: boolean
}

const POSITION_SLOTS: Record<string, { x: number; y: number }> = {
  PG: { x: 50, y: 64 },
  SG: { x: 80, y: 40 },
  SF: { x: 20, y: 40 },
  PF: { x: 68, y: 18 },
  C: { x: 50, y: 10 },
  G: { x: 50, y: 64 },
  F: { x: 32, y: 18 },
}

const FALLBACK_SLOT = { x: 50, y: 40 }

type MiniCourtProps = {
  players: MiniCourtPlayer[]
}

export function MiniCourt({ players }: MiniCourtProps) {
  const filterId = useId()
  const seen: Record<string, number> = {}

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Roster rating mapped to court position">
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="6" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} stroke="var(--court-line)" strokeOpacity="0.6" strokeWidth="0.6" fill="none">
        <line x1="8" y1="4" x2="92" y2="4" />
        <rect x="35" y="4" width="30" height="40" />
        <circle cx="50" cy="44" r="13" />
        <path d="M 8 4 L 8 30 A 42 42 0 0 0 92 30 L 92 4" />
      </g>
      {players.map((player) => {
        const base = POSITION_SLOTS[player.position] ?? FALLBACK_SLOT
        const slotKey = `${base.x}-${base.y}`
        const count = seen[slotKey] ?? 0
        seen[slotKey] = count + 1
        const offset = count * 7
        const x = base.x + (count % 2 === 0 ? offset : -offset)
        const y = base.y
        const radius = 3 + (player.value / 100) * 4.5

        return (
          <g key={player.id} transform={`translate(${x}, ${y})`}>
            {player.emphasized && (
              <circle r={radius + 2.4} fill="none" stroke="var(--text-main)" strokeWidth="0.6" strokeDasharray="1.4 1.4" />
            )}
            <circle r={radius} fill="var(--text-main)" opacity={player.emphasized ? 1 : 0.78} />
            <text y="1.3" textAnchor="middle" fontSize="3.8" fontFamily="var(--font-mono)" fontWeight="700" fill="var(--background)">
              {player.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
