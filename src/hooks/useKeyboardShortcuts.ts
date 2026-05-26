import { useEffect } from 'react'
import type { DrawingTool } from '../types/play'

type KeyboardShortcuts = {
  canUseDrawingTools: boolean
  onEscape: () => void
  onNextStep: () => void
  onPlayPause: () => void
  onPreviousStep: () => void
  onRedo: () => void
  onSaveBoard: () => void
  onSelectTool: (tool: DrawingTool) => void
  onUndo: () => void
}

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select' || target.isContentEditable
}

export function useKeyboardShortcuts({
  canUseDrawingTools,
  onEscape,
  onNextStep,
  onPlayPause,
  onPreviousStep,
  onRedo,
  onSaveBoard,
  onSelectTool,
  onUndo,
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return
      }

      const key = event.key.toLowerCase()
      const meta = event.metaKey || event.ctrlKey

      if (meta && key === 's') {
        event.preventDefault()
        onSaveBoard()
        return
      }

      if (meta && key === 'z' && event.shiftKey) {
        event.preventDefault()
        onRedo()
        return
      }

      if (meta && key === 'z') {
        event.preventDefault()
        onUndo()
        return
      }

      if (meta && key === 'y') {
        event.preventDefault()
        onRedo()
        return
      }

      if (event.key === ' ') {
        event.preventDefault()
        onPlayPause()
        return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNextStep()
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onPreviousStep()
        return
      }

      if (event.key === 'Escape') {
        onEscape()
        return
      }

      if (!canUseDrawingTools) {
        return
      }

      if (key === 'v') onSelectTool('select')
      if (key === 'm') onSelectTool('movement')
      if (key === 'p') onSelectTool('pass')
      if (key === 's' && !meta) onSelectTool('screen')
      if (key === 'e') onSelectTool('erase')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUseDrawingTools, onEscape, onNextStep, onPlayPause, onPreviousStep, onRedo, onSaveBoard, onSelectTool, onUndo])
}
