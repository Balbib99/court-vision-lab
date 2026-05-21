import type { AnnotationType, Play, Player, PlayStep, Position, TacticalAnnotation } from '../types/play'
import { createBoardState, normalizeBoardState } from './boardState'
import { clampPosition } from './positions'

const customPlaysStorageKey = 'court-vision-lab-custom-plays'

type CustomPlayInput = {
  basePlay: Play
  name: string
  description?: string
  players: Player[]
  positions: Record<string, Position>
  ballCarrierId?: string
}

type StepSnapshotInput = {
  ballCarrierId?: string
  description?: string
  players: Player[]
  positions: Record<string, Position>
  title: string
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 42) || 'custom-play'

const createCustomPlayId = (name: string) =>
  `custom-${slugify(name)}-${Date.now().toString(36)}`

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizePosition = (value: unknown): Position | undefined => {
  if (!isRecord(value) || typeof value.x !== 'number' || typeof value.y !== 'number') {
    return undefined
  }

  return clampPosition({ x: value.x, y: value.y })
}

const annotationTypes: AnnotationType[] = ['movement', 'pass', 'screen']

export const createAnnotationId = (type: AnnotationType) =>
  `annotation-${type}-${Date.now().toString(36)}`

const normalizeAnnotation = (value: unknown): TacticalAnnotation | undefined => {
  if (!isRecord(value) || typeof value.id !== 'string' || !annotationTypes.includes(value.type as AnnotationType)) {
    return undefined
  }

  const type = value.type as AnnotationType
  const from = normalizePosition(value.from)
  const to = normalizePosition(value.to)
  const position = normalizePosition(value.position)

  if ((type === 'movement' || type === 'pass') && (!from || !to)) {
    return undefined
  }

  if (type === 'screen' && !position) {
    return undefined
  }

  return {
    id: value.id,
    type,
    from,
    to,
    position,
    label: typeof value.label === 'string' ? value.label : undefined,
    color: typeof value.color === 'string' ? value.color : undefined,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date().toISOString(),
  }
}

const asCustomPlay = (play: Play): Play => {
  const now = new Date().toISOString()

  return {
    ...play,
    source: 'custom',
    isCustom: true,
    createdAt: play.createdAt ?? now,
    updatedAt: now,
  }
}

export const isCustomPlay = (play: Play) =>
  play.source === 'custom' || play.isCustom === true || play.id.startsWith('custom-')

export const createCustomSetupStep = (ballCarrierId?: string): PlayStep => ({
  id: 'custom-setup',
  title: 'Custom setup',
  description: 'Saved board arrangement. Use Edit Mode to continue adjusting player spacing and ball assignment.',
  duration: 900,
  ball: ballCarrierId ? { carrierId: ballCarrierId } : undefined,
  ballOwnerId: ballCarrierId,
  movements: [],
})

export const createStepSnapshot = ({
  ballCarrierId,
  description,
  players,
  positions,
  title,
}: StepSnapshotInput): PlayStep => {
  const now = new Date().toISOString()
  const playerIds = new Set(players.map((player) => player.id))
  const playerPositions = players.reduce<Record<string, Position>>((snapshot, player) => {
    snapshot[player.id] = clampPosition(positions[player.id] ?? player.position)
    return snapshot
  }, {})
  const validBallCarrierId = ballCarrierId && playerIds.has(ballCarrierId) ? ballCarrierId : undefined

  return {
    id: `step-${slugify(title)}-${Date.now().toString(36)}`,
    title: title.trim() || 'New step',
    description: description?.trim() || 'Saved custom play step.',
    duration: 1000,
    ball: validBallCarrierId ? { carrierId: validBallCarrierId } : undefined,
    ballOwnerId: validBallCarrierId,
    movements: [],
    playerPositions,
    createdAt: now,
    updatedAt: now,
  }
}

export const createCustomPlayFromBoard = ({
  basePlay,
  ballCarrierId,
  description,
  name,
  players,
  positions,
}: CustomPlayInput): Play => {
  const normalizedState = createBoardState({
    selectedPlayId: basePlay.id,
    currentStepIndex: 0,
    players,
    positions,
    ballCarrierId,
    isCustom: true,
  })
  const initialPlayers = normalizedState.players.map((player) => ({
    ...player,
    position: clampPosition(normalizedState.positions[player.id] ?? player.position),
    hasBall: player.id === normalizedState.ballCarrierId || undefined,
  }))

  return asCustomPlay({
    id: createCustomPlayId(name),
    name: name.trim(),
    category: 'My Playbook',
    difficulty: basePlay.difficulty,
    description: description?.trim() || `Custom setup based on ${basePlay.name}.`,
    objective: basePlay.objective,
    concepts: ['Custom', ...basePlay.concepts.filter((concept) => concept !== 'Custom').slice(0, 4)],
    initialPlayers,
    steps: [
      createStepSnapshot({
        players: initialPlayers,
        positions: normalizedState.positions,
        ballCarrierId: normalizedState.ballCarrierId,
        title: 'Custom setup',
        description: 'Initial saved board arrangement.',
      }),
    ],
    basePlayId: basePlay.id,
    userDescription: description?.trim() || undefined,
  })
}

export const duplicatePlayAsCustom = (play: Play, name: string): Play =>
  asCustomPlay({
    ...play,
    id: createCustomPlayId(name),
    name: name.trim(),
    source: 'custom',
    isCustom: true,
    basePlayId: play.basePlayId ?? play.id,
    initialPlayers: play.initialPlayers.map((player) => ({ ...player, position: { ...player.position } })),
    steps: play.steps.map((step) => ({
      ...step,
      movements: step.movements.map((movement) => ({ ...movement, to: { ...movement.to } })),
      ball: step.ball ? { ...step.ball, position: step.ball.position ? { ...step.ball.position } : undefined } : undefined,
      ballOwnerId: step.ballOwnerId,
      annotations: step.annotations?.map((annotation) => ({ ...annotation })),
      playerPositions: step.playerPositions
        ? Object.fromEntries(Object.entries(step.playerPositions).map(([playerId, position]) => [playerId, { ...position }]))
        : undefined,
    })),
  })

export const normalizeCustomPlay = (value: unknown): Play | undefined => {
  const state = normalizeBoardState(
    {
      version: 1,
      selectedPlayId: 'custom-play',
      currentStepIndex: 0,
      players: (value as Play | undefined)?.initialPlayers,
      positions: (value as Play | undefined)?.initialPlayers?.reduce<Record<string, Position>>((positions, player) => {
        positions[player.id] = player.position
        return positions
      }, {}),
      ballCarrierId: (value as Play | undefined)?.initialPlayers?.find((player) => player.hasBall)?.id,
      isCustom: true,
    },
    [{ id: 'custom-play', name: '', category: '', difficulty: 'Easy', description: '', objective: '', concepts: [], initialPlayers: [], steps: [] }],
  )

  if (!value || typeof value !== 'object' || !state) {
    return undefined
  }

  const rawPlay = value as Partial<Play>
  if (
    typeof rawPlay.id !== 'string' ||
    !rawPlay.id.startsWith('custom-') ||
    typeof rawPlay.name !== 'string' ||
    !rawPlay.name.trim() ||
    !Array.isArray(rawPlay.steps)
  ) {
    return undefined
  }

  const playerIds = new Set(state.players.map((player) => player.id))
  const normalizedSteps = rawPlay.steps.flatMap((step, index) => {
    if (!isRecord(step)) {
      return []
    }

    const movements = Array.isArray(step.movements)
      ? step.movements.flatMap((movement) => {
        if (!isRecord(movement) || typeof movement.playerId !== 'string' || !playerIds.has(movement.playerId)) {
          return []
        }

        const to = normalizePosition(movement.to)
        if (!to) {
          return []
        }

        return [{
          playerId: movement.playerId,
          to,
          duration: typeof movement.duration === 'number' ? movement.duration : undefined,
          note: typeof movement.note === 'string' ? movement.note : undefined,
        }]
      })
      : []
    const ballCarrierId = isRecord(step.ball) && typeof step.ball.carrierId === 'string' && playerIds.has(step.ball.carrierId)
      ? step.ball.carrierId
      : typeof step.ballOwnerId === 'string' && playerIds.has(step.ballOwnerId)
        ? step.ballOwnerId
      : undefined
    const ballPosition = isRecord(step.ball) ? normalizePosition(step.ball.position) : undefined
    const playerPositions = isRecord(step.playerPositions)
      ? Object.entries(step.playerPositions).reduce<Record<string, Position>>((positions, [playerId, position]) => {
        if (playerIds.has(playerId)) {
          const normalizedPosition = normalizePosition(position)
          if (normalizedPosition) {
            positions[playerId] = normalizedPosition
          }
        }

        return positions
      }, {})
      : undefined
    const annotations = Array.isArray(step.annotations)
      ? step.annotations.flatMap((annotation) => {
        const normalizedAnnotation = normalizeAnnotation(annotation)
        return normalizedAnnotation ? [normalizedAnnotation] : []
      })
      : undefined

    return [{
      id: typeof step.id === 'string' ? step.id : `custom-step-${index + 1}`,
      title: typeof step.title === 'string' ? step.title : `Custom step ${index + 1}`,
      description: typeof step.description === 'string' ? step.description : 'Saved custom play step.',
      duration: typeof step.duration === 'number' ? step.duration : 900,
      ball: ballCarrierId || ballPosition ? { carrierId: ballCarrierId, position: ballPosition } : undefined,
      ballOwnerId: ballCarrierId,
      movements,
      playerPositions: playerPositions && Object.keys(playerPositions).length > 0 ? playerPositions : undefined,
      annotations,
      createdAt: typeof step.createdAt === 'string' ? step.createdAt : undefined,
      updatedAt: typeof step.updatedAt === 'string' ? step.updatedAt : undefined,
    }]
  })

  return asCustomPlay({
    id: rawPlay.id,
    name: rawPlay.name.trim(),
    category: typeof rawPlay.category === 'string' ? rawPlay.category : 'My Playbook',
    difficulty: rawPlay.difficulty === 'Advanced' || rawPlay.difficulty === 'Medium' ? rawPlay.difficulty : 'Easy',
    description: typeof rawPlay.description === 'string' ? rawPlay.description : 'Custom play.',
    objective: typeof rawPlay.objective === 'string' ? rawPlay.objective : 'Run a saved custom board setup.',
    concepts: Array.isArray(rawPlay.concepts) ? rawPlay.concepts.filter((concept): concept is string => typeof concept === 'string') : ['Custom'],
    initialPlayers: state.players,
    steps: normalizedSteps.length > 0 ? normalizedSteps : [createCustomSetupStep(state.ballCarrierId)],
    createdAt: typeof rawPlay.createdAt === 'string' ? rawPlay.createdAt : undefined,
    updatedAt: typeof rawPlay.updatedAt === 'string' ? rawPlay.updatedAt : undefined,
    basePlayId: typeof rawPlay.basePlayId === 'string' ? rawPlay.basePlayId : undefined,
    userDescription: typeof rawPlay.userDescription === 'string' ? rawPlay.userDescription : undefined,
  })
}

export const loadCustomPlays = (): Play[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawPlays = window.localStorage.getItem(customPlaysStorageKey)
    if (!rawPlays) {
      return []
    }

    const parsedPlays = JSON.parse(rawPlays)
    if (!Array.isArray(parsedPlays)) {
      return []
    }

    return parsedPlays.flatMap((play) => {
      const normalizedPlay = normalizeCustomPlay(play)
      return normalizedPlay ? [normalizedPlay] : []
    })
  } catch {
    return []
  }
}

export const saveCustomPlays = (customPlays: Play[]) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(customPlaysStorageKey, JSON.stringify(customPlays.map(asCustomPlay)))
}
