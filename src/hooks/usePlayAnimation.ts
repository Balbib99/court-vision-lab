import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Play, Position } from '../types/play'
import { getBallHandler, getStepPositions, resolveBallPosition } from '../utils/positions'

export const usePlayAnimation = (play: Play) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
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
    setCurrentStepIndex(0)
  }, [clearTimer])

  const goToStep = useCallback(
    (stepIndex: number) => {
      clearTimer()
      setIsPlaying(false)
      setCurrentStepIndex(Math.min(Math.max(stepIndex, 0), play.steps.length - 1))
    },
    [clearTimer, play.steps.length],
  )

  const nextStep = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
    setCurrentStepIndex((current) => Math.min(current + 1, play.steps.length - 1))
  }, [clearTimer, play.steps.length])

  const previousStep = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
    setCurrentStepIndex((current) => Math.max(current - 1, 0))
  }, [clearTimer])

  const playFullSequence = useCallback(() => {
    clearTimer()
    setIsPlaying((current) => {
      if (current) {
        return false
      }

      setCurrentStepIndex((stepIndex) => (stepIndex >= play.steps.length - 1 ? 0 : stepIndex))
      return true
    })
  }, [clearTimer, play.steps.length])

  useEffect(() => {
    if (!isPlaying) {
      return
    }

    const step = play.steps[currentStepIndex]
    if (!step) {
      return
    }

    timeoutRef.current = window.setTimeout(() => {
      if (currentStepIndex >= play.steps.length - 1) {
        setIsPlaying(false)
        return
      }

      setCurrentStepIndex((current) => current + 1)
    }, step.duration ?? 1000)

    return clearTimer
  }, [clearTimer, currentStepIndex, isPlaying, play.steps])

  const positions = useMemo(
    () => getStepPositions(play, currentStepIndex),
    [currentStepIndex, play],
  )

  const activeStep = play.steps[currentStepIndex]
  const ballHandler = getBallHandler(play)

  const ballPosition: Position = resolveBallPosition(
    positions,
    activeStep?.ball?.carrierId,
    activeStep?.ball?.position ?? positions[ballHandler.id] ?? ballHandler.position,
  )

  return {
    activeStep,
    activeStepIndex: currentStepIndex,
    ballPosition,
    currentPlayers: positions,
    currentStepIndex,
    goToStep,
    isPlaying,
    nextStep,
    playFullSequence,
    previousStep,
    positions,
    reset,
  }
}
