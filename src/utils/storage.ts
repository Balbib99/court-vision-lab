import type { Play } from '../types/play'
import { normalizeBoardState, type SavedBoardState } from './boardState'

const boardStateKey = 'court-vision-lab:board-state'

export const loadBoardState = (plays: Play[]): SavedBoardState | undefined => {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    const rawState = window.localStorage.getItem(boardStateKey)
    if (!rawState) {
      return undefined
    }

    return normalizeBoardState(JSON.parse(rawState), plays)
  } catch {
    return undefined
  }
}

export const saveBoardState = (state: SavedBoardState) => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(boardStateKey, JSON.stringify(state))
}

export const removeBoardState = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(boardStateKey)
}
