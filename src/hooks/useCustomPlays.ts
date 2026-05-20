import { useCallback, useMemo, useState } from 'react'
import type { Play } from '../types/play'
import { isCustomPlay, loadCustomPlays, saveCustomPlays } from '../utils/customPlays'

export function useCustomPlays() {
  const [customPlays, setCustomPlays] = useState<Play[]>(() => loadCustomPlays())

  const persistCustomPlays = useCallback((nextCustomPlays: Play[]) => {
    setCustomPlays(nextCustomPlays)
    saveCustomPlays(nextCustomPlays)
  }, [])

  const addCustomPlay = useCallback(
    (play: Play) => {
      const customPlay = { ...play, source: 'custom' as const, isCustom: true }
      persistCustomPlays([...customPlays.filter((item) => item.id !== customPlay.id), customPlay])
      return customPlay
    },
    [customPlays, persistCustomPlays],
  )

  const deleteCustomPlay = useCallback(
    (playId: string) => {
      persistCustomPlays(customPlays.filter((play) => play.id !== playId))
    },
    [customPlays, persistCustomPlays],
  )

  const updateCustomPlay = useCallback(
    (play: Play) => {
      const updatedPlay = {
        ...play,
        source: 'custom' as const,
        isCustom: true,
        updatedAt: new Date().toISOString(),
      }
      persistCustomPlays(customPlays.map((item) => (item.id === updatedPlay.id ? updatedPlay : item)))
      return updatedPlay
    },
    [customPlays, persistCustomPlays],
  )

  const customPlayIds = useMemo(
    () => new Set(customPlays.filter(isCustomPlay).map((play) => play.id)),
    [customPlays],
  )

  return {
    addCustomPlay,
    customPlayIds,
    customPlays,
    deleteCustomPlay,
    updateCustomPlay,
  }
}
