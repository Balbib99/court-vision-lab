import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Play, Position } from '../types/play'
import { getBallHandler, getStepPositions, resolveBallPosition } from '../utils/positions'

export const usePlayAnimation = (play: Play) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
  }, [])

  const reset = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
    setActiveStepIndex(0)
  }, [clearTimer])

  const playAnimation = useCallback(() => {
    clearTimer()
    setIsPlaying((current) => !current)
  }, [clearTimer])

  const goToStep = useCallback(
    (stepIndex: number) => {
      clearTimer()
      setIsPlaying(false)
      setActiveStepIndex(Math.min(Math.max(stepIndex, 0), play.steps.length - 1))
    },
    [clearTimer, play.steps.length],
  )

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const step = play.steps[activeStepIndex]
    if (!step) {
      setIsPlaying(false)
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      if (activeStepIndex >= play.steps.length - 1) {
        setIsPlaying(false)
        return
      }

      setActiveStepIndex((current) => current + 1)
    }, step.duration ?? 1000)

    return clearTimer
  }, [activeStepIndex, clearTimer, isPlaying, play.steps])

  useEffect(() => reset(), [play.id, reset])

  const positions = useMemo(
    () => getStepPositions(play, activeStepIndex),
    [activeStepIndex, play],
  )

  const activeStep = play.steps[activeStepIndex]
  const ballHandler = getBallHandler(play)

  const ballPosition: Position = resolveBallPosition(
    positions,
    activeStep?.ball?.carrierId,
    activeStep?.ball?.position ?? positions[ballHandler.id] ?? ballHandler.position,
  )

  return {
    activeStep,
    activeStepIndex,
    ballPosition,
    goToStep,
    isPlaying,
    playAnimation,
    positions,
    reset,
  }
}
