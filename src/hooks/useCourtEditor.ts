import { useCallback, useMemo, useState } from 'react'
import type { Play, Player, Position, Team } from '../types/play'
import { getBallHandler, getInitialPositions, resolveBallPosition } from '../utils/positions'
import { canAddPlayer, createRosterPlayer } from '../utils/roster'

export function useCourtEditor(play: Play, onEnterEditMode?: () => void) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedPlayers, setEditedPlayers] = useState<Player[]>(play.initialPlayers)
  const [editedPositions, setEditedPositions] = useState(() => getInitialPositions(play.initialPlayers))
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>()
  const [ballCarrierId, setBallCarrierId] = useState<string | undefined>(() => getBallHandler(play).id)

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
  }, [selectedPlayerId])

  const resetEditedPositions = useCallback(() => {
    setEditedPlayers(play.initialPlayers)
    setEditedPositions(getInitialPositions(play.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(play).id)
  }, [play])

  const resetForPlay = useCallback((nextPlay: Play) => {
    setIsEditMode(false)
    setEditedPlayers(nextPlay.initialPlayers)
    setEditedPositions(getInitialPositions(nextPlay.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(nextPlay).id)
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
  }, [isEditMode, selectedPlayerId])

  const selectedPlayer = useMemo(
    () => editedPlayers.find((player) => player.id === selectedPlayerId),
    [editedPlayers, selectedPlayerId],
  )

  const editedBallPosition = resolveBallPosition(
    editedPositions,
    ballCarrierId,
    getBallHandler(play).position,
  )

  return {
    addPlayer,
    assignBallToSelected,
    ballCarrierId,
    canAddDefense: isEditMode && canAddPlayer(editedPlayers, 'defense'),
    canAddOffense: isEditMode && canAddPlayer(editedPlayers, 'offense'),
    editedBallPosition,
    editedPlayers,
    editedPositions,
    isEditMode,
    resetEditedPositions,
    resetForPlay,
    removeSelectedPlayer,
    selectedPlayer,
    selectedPlayerId,
    selectPlayer,
    toggleEditMode,
    updatePlayerPosition,
  }
}
