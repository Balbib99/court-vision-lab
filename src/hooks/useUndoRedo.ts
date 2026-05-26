import { useCallback, useState } from 'react'

export function useUndoRedo<T>(limit = 40) {
  const [past, setPast] = useState<T[]>([])
  const [future, setFuture] = useState<T[]>([])

  const record = useCallback((snapshot: T) => {
    setPast((current) => [...current.slice(Math.max(0, current.length - limit + 1)), snapshot])
    setFuture([])
  }, [limit])

  const undo = useCallback((currentSnapshot: T) => {
    const target = past[past.length - 1]
    if (!target) {
      return undefined
    }

    setPast(past.slice(0, -1))
    setFuture((currentFuture) => [currentSnapshot, ...currentFuture].slice(0, limit))
    return target
  }, [limit, past])

  const redo = useCallback((currentSnapshot: T) => {
    const target = future[0]
    if (!target) {
      return undefined
    }

    setFuture(future.slice(1))
    setPast((currentPast) => [...currentPast.slice(Math.max(0, currentPast.length - limit + 1)), currentSnapshot])
    return target
  }, [future, limit])

  const clear = useCallback(() => {
    setPast([])
    setFuture([])
  }, [])

  return {
    canRedo: future.length > 0,
    canUndo: past.length > 0,
    clear,
    record,
    redo,
    undo,
  }
}
