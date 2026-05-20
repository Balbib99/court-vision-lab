import { useCallback, useMemo, useState } from 'react'
import type { Play, Position } from '../types/play'
import { getBallHandler, getInitialPositions, resolveBallPosition } from '../utils/positions'

export function useCourtEditor(play: Play, onEnterEditMode?: () => void) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedPositions, setEditedPositions] = useState(() => getInitialPositions(play.initialPlayers))
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>()
  const [ballCarrierId, setBallCarrierId] = useState(() => getBallHandler(play).id)

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
    setEditedPositions(getInitialPositions(play.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(play).id)
  }, [play])

  const resetForPlay = useCallback((nextPlay: Play) => {
    setIsEditMode(false)
    setEditedPositions(getInitialPositions(nextPlay.initialPlayers))
    setSelectedPlayerId(undefined)
    setBallCarrierId(getBallHandler(nextPlay).id)
  }, [])

  const selectedPlayer = useMemo(
    () => play.initialPlayers.find((player) => player.id === selectedPlayerId),
    [play.initialPlayers, selectedPlayerId],
  )

  const editedBallPosition = resolveBallPosition(
    editedPositions,
    ballCarrierId,
    getBallHandler(play).position,
  )

  return {
    assignBallToSelected,
    ballCarrierId,
    editedBallPosition,
    editedPositions,
    isEditMode,
    resetEditedPositions,
    resetForPlay,
    selectedPlayer,
    selectedPlayerId,
    selectPlayer,
    toggleEditMode,
    updatePlayerPosition,
  }
}
