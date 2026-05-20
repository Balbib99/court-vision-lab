import { useCallback, useMemo, useState } from 'react'
import type { Play, Player, Position, Team } from '../types/play'
import type { SavedBoardState } from '../utils/boardState'
import { getBallHandler, getInitialPositions, resolveBallPosition } from '../utils/positions'
import { canAddPlayer, createRosterPlayer } from '../utils/roster'

export function useCourtEditor(
  play: Play,
  onEnterEditMode?: () => void,
  initialBoardState?: SavedBoardState,
) {
  const [isEditMode, setIsEditMode] = useState(Boolean(initialBoardState?.isCustom))
  const [editedPlayers, setEditedPlayers] = useState<Player[]>(initialBoardState?.players ?? play.initialPlayers)
  const [editedPositions, setEditedPositions] = useState(() => initialBoardState?.positions ?? getInitialPositions(play.initialPlayers))
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>()
  const [ballCarrierId, setBallCarrierId] = useState<string | undefined>(() => initialBoardState?.ballCarrierId ?? getBallHandler(play)?.id)
  const [isBoardCustom, setIsBoardCustom] = useState(Boolean(initialBoardState?.isCustom))

  const toggleEditMode = useCallback(() => {
    setIsEditMode((current) => {
      const nextMode = !current
      if (nextMode) {
        onEnterEditMode?.()
      }
      return nextMode
    })
  }, [onEnterEditMode])

  const updatePlayerPosition = useCallback((playerId: string, position: Position) => {
    setIsBoardCustom(true)
    setEditedPositions((currentPositions) => ({
      ...currentPositions,
      [playerId]: position,
    }))
  }, [])

  const selectPlayer = useCallback((playerId: string) => {
    setSelectedPlayerId(playerId)
  }, [])

  const assignBallToSelected = useCallback(() => {
    if (!selectedPlayerId) {
      return
    }

    setBallCarrierId(selectedPlayerId)
    setIsBoardCustom(true)
  }, [selectedPlayerId])

  const resetEditedPositions = useCallback(() => {
    setEditedPlayers(play.initialPlayers)
    setEditedPositions(getInitialPositions(play.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(play)?.id)
    setIsBoardCustom(false)
  }, [play])

  const resetForPlay = useCallback((nextPlay: Play) => {
    setIsEditMode(false)
    setEditedPlayers(nextPlay.initialPlayers)
    setEditedPositions(getInitialPositions(nextPlay.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(nextPlay)?.id)
    setIsBoardCustom(false)
  }, [])

  const restoreBoardState = useCallback((state: SavedBoardState) => {
    setIsEditMode(Boolean(state.isCustom))
    setEditedPlayers(state.players)
    setEditedPositions(state.positions)
    setSelectedPlayerId(undefined)
    setBallCarrierId(state.ballCarrierId)
    setIsBoardCustom(Boolean(state.isCustom))
  }, [])

  const resetToPlayDefaults = useCallback(() => {
    setEditedPlayers(play.initialPlayers)
    setEditedPositions(getInitialPositions(play.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(play)?.id)
    setIsBoardCustom(false)
  }, [play])

  const clearBoard = useCallback(() => {
    onEnterEditMode?.()
    setIsEditMode(true)
    setEditedPlayers([])
    setEditedPositions({})
    setSelectedPlayerId(undefined)
    setBallCarrierId(undefined)
    setIsBoardCustom(true)
  }, [onEnterEditMode])

  const applyStepSnapshot = useCallback((players: Player[], positions: Record<string, Position>, nextBallCarrierId?: string) => {
    setEditedPlayers(players)
    setEditedPositions(positions)
    setSelectedPlayerId(undefined)
    setBallCarrierId(nextBallCarrierId)
  }, [])

  const addPlayer = useCallback(
    (team: Team) => {
      if (!isEditMode) {
        return
      }

      setEditedPlayers((currentPlayers) => {
        const newPlayer = createRosterPlayer(currentPlayers, play.initialPlayers, team)
        if (!newPlayer) {
          return currentPlayers
        }

        setEditedPositions((currentPositions) => ({
          ...currentPositions,
          [newPlayer.id]: newPlayer.position,
        }))
        setSelectedPlayerId(newPlayer.id)
        setIsBoardCustom(true)

        return [...currentPlayers, newPlayer]
      })
    },
    [isEditMode, play.initialPlayers],
  )

  const removeSelectedPlayer = useCallback(() => {
    if (!isEditMode || !selectedPlayerId) {
      return
    }

    setEditedPlayers((currentPlayers) => currentPlayers.filter((player) => player.id !== selectedPlayerId))
    setEditedPositions((currentPositions) => {
      const nextPositions = { ...currentPositions }
      delete nextPositions[selectedPlayerId]
      return nextPositions
    })
    setBallCarrierId((currentCarrierId) => (currentCarrierId === selectedPlayerId ? undefined : currentCarrierId))
    setSelectedPlayerId(undefined)
    setIsBoardCustom(true)
  }, [isEditMode, selectedPlayerId])

  const selectedPlayer = useMemo(
    () => editedPlayers.find((player) => player.id === selectedPlayerId),
    [editedPlayers, selectedPlayerId],
  )

  const editedBallPosition = ballCarrierId
    ? resolveBallPosition(
      editedPositions,
      ballCarrierId,
      getBallHandler(play)?.position,
    )
    : undefined

  return {
    addPlayer,
    applyStepSnapshot,
    assignBallToSelected,
    ballCarrierId,
    canAddDefense: isEditMode && canAddPlayer(editedPlayers, 'defense'),
    canAddOffense: isEditMode && canAddPlayer(editedPlayers, 'offense'),
    clearBoard,
    editedBallPosition,
    editedPlayers,
    editedPositions,
    isBoardCustom,
    isEditMode,
    resetEditedPositions,
    resetForPlay,
    resetToPlayDefaults,
    restoreBoardState,
    removeSelectedPlayer,
    selectedPlayer,
    selectedPlayerId,
    selectPlayer,
    toggleEditMode,
    updatePlayerPosition,
  }
}
