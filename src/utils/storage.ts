import type { Play } from '../types/play'
import { normalizeBoardState, type SavedBoardState } from './boardState'

const legacyBoardStateKey = 'court-vision-lab:board-state'
const boardStateStorageKey = 'court-vision-lab-board-state'

export const loadBoardState = (plays: Play[]): SavedBoardState | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const rawState =
      window.localStorage.getItem(boardStateStorageKey) ??
      window.localStorage.getItem(legacyBoardStateKey)
    if (!rawState) {
      return undefined
    }

    const state = normalizeBoardState(JSON.parse(rawState), plays)
    if (state && !window.localStorage.getItem(boardStateStorageKey)) {
      saveBoardState(state)
      window.localStorage.removeItem(legacyBoardStateKey)
    }

    return state
  } catch {
    return undefined
  }
}

export const saveBoardState = (state: SavedBoardState) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(boardStateStorageKey, JSON.stringify(state))
}

export const removeBoardState = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(boardStateStorageKey)
  window.localStorage.removeItem(legacyBoardStateKey)
}
