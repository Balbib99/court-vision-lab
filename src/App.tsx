import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Court } from './components/court/Court'
import { AppShell } from './components/layout/AppShell'
import type { BoardSaveStatus } from './components/layout/TopBar'
import { PlayDetailsPanel } from './components/plays/PlayDetailsPanel'
import { defaultPlay, plays } from './data/plays'
import { useCourtEditor } from './hooks/useCourtEditor'
import { usePlayAnimation } from './hooks/usePlayAnimation'
import { useTheme } from './hooks/useTheme'
import { createBoardState } from './utils/boardState'
import { getBallHandler, getInitialPositions } from './utils/positions'
import { loadBoardState, saveBoardState } from './utils/storage'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [initialBoardState] = useState(() => loadBoardState(plays))
  const [selectedPlayId, setSelectedPlayId] = useState(initialBoardState?.selectedPlayId ?? defaultPlay.id)
  const [saveStatus, setSaveStatus] = useState<BoardSaveStatus>('idle')
  const saveStatusTimerRef = useRef<number | undefined>(undefined)
  const didPrimeAutosaveRef = useRef(false)
  const selectedPlay = useMemo(
    () => plays.find((play) => play.id === selectedPlayId) ?? defaultPlay,
    [selectedPlayId],
  )
  const {
    activeStep,
    activeStepIndex,
    ballPosition,
    goToStep,
    isPlaying,
    nextStep,
    pause,
    playFullSequence,
    positions,
    previousStep,
    reset,
  } =
    usePlayAnimation(selectedPlay, initialBoardState?.currentStepIndex)
  const {
    addPlayer,
    assignBallToSelected,
    ballCarrierId,
    canAddDefense,
    canAddOffense,
    clearBoard,
    editedBallPosition,
    editedPlayers,
    editedPositions,
    isBoardCustom,
    isEditMode,
    resetEditedPositions,
    resetForPlay,
    resetToPlayDefaults,
    removeSelectedPlayer,
    selectedPlayer,
    selectedPlayerId,
    selectPlayer,
    toggleEditMode,
    updatePlayerPosition,
  } = useCourtEditor(selectedPlay, pause, initialBoardState)
  const courtPositions = isEditMode ? editedPositions : positions
  const courtBallPosition = isEditMode ? editedBallPosition : ballPosition

  const showSaveFeedback = useCallback((status: Exclude<BoardSaveStatus, 'idle'>) => {
    if (saveStatusTimerRef.current) {
      window.clearTimeout(saveStatusTimerRef.current)
    }

    setSaveStatus(status)
    saveStatusTimerRef.current = window.setTimeout(() => {
      setSaveStatus('idle')
      saveStatusTimerRef.current = undefined
    }, status === 'unsaved' ? 2200 : 1500)
  }, [])

  const createDefaultStateForPlay = useCallback((play = selectedPlay) => {
    const defaultPositions = getInitialPositions(play.initialPlayers)

    return createBoardState({
      selectedPlayId: play.id,
      currentStepIndex: 0,
      players: play.initialPlayers,
      positions: defaultPositions,
      ballCarrierId: getBallHandler(play).id,
      isCustom: false,
    })
  }, [selectedPlay])

  const createCurrentBoardState = useCallback(() => {
    const playBallCarrierId = activeStep?.ball?.carrierId ?? getBallHandler(selectedPlay).id

    return createBoardState({
      selectedPlayId: selectedPlay.id,
      currentStepIndex: activeStepIndex,
      players: isEditMode ? editedPlayers : selectedPlay.initialPlayers,
      positions: isEditMode ? editedPositions : positions,
      ballCarrierId: isEditMode ? ballCarrierId : playBallCarrierId,
      isCustom: isBoardCustom,
    })
  }, [
    activeStep?.ball?.carrierId,
    activeStepIndex,
    ballCarrierId,
    editedPlayers,
    editedPositions,
    isBoardCustom,
    isEditMode,
    positions,
    selectedPlay,
  ])

  const handleSaveBoard = useCallback(() => {
    saveBoardState(createCurrentBoardState())
    showSaveFeedback('saved')
  }, [createCurrentBoardState, showSaveFeedback])

  useEffect(() => {
    if (!isEditMode) {
      didPrimeAutosaveRef.current = false
      return
    }

    if (!didPrimeAutosaveRef.current) {
      didPrimeAutosaveRef.current = true
      return
    }

    setSaveStatus('unsaved')
    const autosaveTimer = window.setTimeout(() => {
      saveBoardState(createCurrentBoardState())
      showSaveFeedback('autosaved')
    }, 650)

    return () => window.clearTimeout(autosaveTimer)
  }, [createCurrentBoardState, isEditMode, showSaveFeedback])

  const handleSelectPlay = (playId: string) => {
    const nextPlay = plays.find((play) => play.id === playId) ?? defaultPlay
    reset()
    resetForPlay(nextPlay)
    setSelectedPlayId(playId)
    saveBoardState(createDefaultStateForPlay(nextPlay))
  }

  const handleReset = () => {
    if (isEditMode) {
      resetEditedPositions()
      return
    }

    reset()
  }

  const handleResetToPlayDefaults = () => {
    reset()
    resetToPlayDefaults()
    saveBoardState(createDefaultStateForPlay())
    showSaveFeedback('saved')
  }

  const handleClearBoard = () => {
    if (!isEditMode || editedPlayers.length === 0) {
      return
    }

    const confirmed = window.confirm('Clear the current board? This will remove all players from the court.')
    if (!confirmed) {
      return
    }

    reset()
    clearBoard()
    saveBoardState(createBoardState({
      selectedPlayId: selectedPlay.id,
      currentStepIndex: 0,
      players: [],
      positions: {},
      ballCarrierId: undefined,
      isCustom: true,
    }))
    showSaveFeedback('saved')
  }

  const canClearBoard = isEditMode && editedPlayers.length > 0
  const clearBoardLabel = !isEditMode
    ? 'Clear Board available in Edit Mode'
    : editedPlayers.length > 0
      ? 'Clear Board'
      : 'Board is already clear'

  return (
    <AppShell
      activePlay={selectedPlay}
      activeStep={activeStep}
      activeStepIndex={activeStepIndex}
      ballCarrierId={ballCarrierId}
      canAddDefense={canAddDefense}
      canAddOffense={canAddOffense}
      canClearBoard={canClearBoard}
      clearBoardLabel={clearBoardLabel}
      isPlaying={isPlaying}
      isEditMode={isEditMode}
      onAddDefense={() => addPlayer('defense')}
      onAddOffense={() => addPlayer('offense')}
      onAssignBall={assignBallToSelected}
      onClearBoard={handleClearBoard}
      onNextStep={nextStep}
      onPlayFullSequence={playFullSequence}
      onPreviousStep={previousStep}
      onReset={handleReset}
      onRemoveSelectedPlayer={removeSelectedPlayer}
      onResetToPlayDefaults={handleResetToPlayDefaults}
      onSaveBoard={handleSaveBoard}
      onStepSelect={goToStep}
      onToggleEditMode={toggleEditMode}
      onToggleTheme={toggleTheme}
      saveStatus={saveStatus}
      selectedPlayer={selectedPlayer}
      stepCount={selectedPlay.steps.length}
      theme={theme}
    >
      <motion.div
        className="relative flex min-h-[calc(100vh-80px)] flex-col xl:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Court
          play={selectedPlay}
          positions={courtPositions}
          ballPosition={courtBallPosition}
          activeStep={activeStep}
          activeStepIndex={activeStepIndex}
          ballCarrierId={isEditMode ? ballCarrierId : undefined}
          isEditMode={isEditMode}
          onMovePlayer={updatePlayerPosition}
          onSelectPlayer={selectPlayer}
          players={isEditMode ? editedPlayers : undefined}
          selectedPlayerId={selectedPlayerId}
        />
        <PlayDetailsPanel
          activeStep={activeStep}
          activeStepIndex={activeStepIndex}
          ballCarrierId={ballCarrierId}
          isEditMode={isEditMode}
          onAssignBall={assignBallToSelected}
          onSelectPlay={handleSelectPlay}
          play={selectedPlay}
          plays={plays}
          selectedPlayer={selectedPlayer}
        />
      </motion.div>
    </AppShell>
  )
}

export default App
