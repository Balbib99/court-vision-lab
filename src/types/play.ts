export type Team = 'offense' | 'defense'

export type Position = {
  x: number
  y: number
}

export type Player = {
  id: string
  label: string
  team: Team
  position: Position
  role?: string
  hasBall?: boolean
}

export type Movement = {
  playerId: string
  to: Position
  duration?: number
  note?: string
}

export type BallState = {
  carrierId?: string
  position?: Position
}

export type AnnotationType = 'movement' | 'pass' | 'screen'
export type DrawingTool = 'select' | 'movement' | 'pass' | 'screen' | 'erase'

export type TacticalAnnotation = {
  id: string
  type: AnnotationType
  from?: Position
  to?: Position
  position?: Position
  label?: string
  color?: string
  createdAt: string
}

export type PlayStep = {
  id: string
  title: string
  description: string
  duration?: number
  movements: Movement[]
  ball?: BallState
  playerPositions?: Record<string, Position>
  ballOwnerId?: string
  annotations?: TacticalAnnotation[]
  createdAt?: string
  updatedAt?: string
}

export type Play = {
  id: string
  name: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Advanced'
  description: string
  objective: string
  concepts: string[]
  initialPlayers: Player[]
  steps: PlayStep[]
  source?: 'built-in' | 'custom'
  createdAt?: string
  updatedAt?: string
  isCustom?: boolean
  basePlayId?: string
  userDescription?: string
}
