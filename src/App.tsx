import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Court } from './components/court/Court'
import { AppShell } from './components/layout/AppShell'
import type { BoardSaveStatus } from './components/layout/TopBar'
import { PlayDetailsPanel } from './components/plays/PlayDetailsPanel'
import { defaultPlay, plays } from './data/plays'
import { useCustomPlays } from './hooks/useCustomPlays'
import { useCourtEditor } from './hooks/useCourtEditor'
import { usePlayAnimation } from './hooks/usePlayAnimation'
import { useTheme } from './hooks/useTheme'
import { createCustomPlayFromBoard, createStepSnapshot, duplicatePlayAsCustom, isCustomPlay } from './utils/customPlays'
import { createBoardState } from './utils/boardState'
import { getBallHandler, getInitialPositions } from './utils/positions'
import { loadBoardState, saveBoardState } from './utils/storage'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { addCustomPlay, customPlays, deleteCustomPlay, updateCustomPlay } = useCustomPlays()
  const allPlays = useMemo(() => [...plays, ...customPlays], [customPlays])
  const [initialBoardState] = useState(() => loadBoardState([...plays, ...customPlays]))
  const [selectedPlayId, setSelectedPlayId] = useState(initialBoardState?.selectedPlayId ?? defaultPlay.id)
  const [saveStatus, setSaveStatus] = useState<BoardSaveStatus>('idle')
  const [playbookMessage, setPlaybookMessage] = useState('')
  const saveStatusTimerRef = useRef<number | undefined>(undefined)
  const playbookMessageTimerRef = useRef<number | undefined>(undefined)
  const didPrimeAutosaveRef = useRef(false)
  const selectedPlay = useMemo(
    () => allPlays.find((play) => play.id === selectedPlayId) ?? defaultPlay,
    [allPlays, selectedPlayId],
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
    applyStepSnapshot,
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
  const selectedPlayIsCustom = isCustomPlay(selectedPlay)
  const currentEditorPlayers = isEditMode ? editedPlayers : selectedPlay.initialPlayers
  const currentBallCarrierId = isEditMode ? ballCarrierId : activeStep?.ballOwnerId ?? activeStep?.ball?.carrierId ?? getBallHandler(selectedPlay)?.id

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

  const showPlaybookMessage = useCallback((message: string) => {
    if (playbookMessageTimerRef.current) {
      window.clearTimeout(playbookMessageTimerRef.current)
    }

    setPlaybookMessage(message)
    playbookMessageTimerRef.current = window.setTimeout(() => {
      setPlaybookMessage('')
      playbookMessageTimerRef.current = undefined
    }, 1800)
  }, [])

  const createDefaultStateForPlay = useCallback((play = selectedPlay) => {
    const defaultPositions = getInitialPositions(play.initialPlayers)

    return createBoardState({
      selectedPlayId: play.id,
      currentStepIndex: 0,
      players: play.initialPlayers,
      positions: defaultPositions,
      ballCarrierId: getBallHandler(play)?.id,
      isCustom: false,
    })
  }, [selectedPlay])

  const createCurrentBoardState = useCallback(() => {
    const playBallCarrierId = activeStep?.ballOwnerId ?? activeStep?.ball?.carrierId ?? getBallHandler(selectedPlay)?.id

    return createBoardState({
      selectedPlayId: selectedPlay.id,
      currentStepIndex: activeStepIndex,
      players: isEditMode ? editedPlayers : selectedPlay.initialPlayers,
      positions: isEditMode ? editedPositions : positions,
      ballCarrierId: isEditMode ? ballCarrierId : playBallCarrierId,
      isCustom: isBoardCustom,
    })
  }, [
    activeStep?.ballOwnerId,
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
    const nextPlay = allPlays.find((play) => play.id === playId) ?? defaultPlay
    reset()
    resetForPlay(nextPlay)
    setSelectedPlayId(playId)
    saveBoardState(createDefaultStateForPlay(nextPlay))
  }

  const applyCustomStepToEditor = useCallback(
    (play: typeof selectedPlay, stepIndex: number) => {
      const step = play.steps[stepIndex]
      applyStepSnapshot(
        play.initialPlayers,
        step?.playerPositions ?? getInitialPositions(play.initialPlayers),
        step?.ballOwnerId ?? step?.ball?.carrierId,
      )
    },
    [applyStepSnapshot],
  )

  const handleStepSelect = (stepIndex: number) => {
    goToStep(stepIndex)
    if (selectedPlayIsCustom) {
      applyCustomStepToEditor(selectedPlay, stepIndex)
    }
  }

  const handlePreviousStep = () => {
    if (selectedPlayIsCustom && isEditMode) {
      const stepIndex = Math.max(activeStepIndex - 1, 0)
      goToStep(stepIndex)
      applyCustomStepToEditor(selectedPlay, stepIndex)
      return
    }

    previousStep()
  }

  const handleNextStep = () => {
    if (selectedPlayIsCustom && isEditMode) {
      const stepIndex = Math.min(activeStepIndex + 1, selectedPlay.steps.length - 1)
      goToStep(stepIndex)
      applyCustomStepToEditor(selectedPlay, stepIndex)
      return
    }

    nextStep()
  }

  const persistUpdatedCustomPlay = (nextPlay: typeof selectedPlay, stepIndex = activeStepIndex) => {
    const updatedPlay = updateCustomPlay(nextPlay)
    setSelectedPlayId(updatedPlay.id)
    goToStep(Math.min(stepIndex, updatedPlay.steps.length - 1))
    saveBoardState(createBoardState({
      selectedPlayId: updatedPlay.id,
      currentStepIndex: Math.min(stepIndex, updatedPlay.steps.length - 1),
      players: currentEditorPlayers,
      positions: courtPositions,
      ballCarrierId: currentBallCarrierId,
      isCustom: true,
    }))
    return updatedPlay
  }

  const handleAddStep = () => {
    if (!selectedPlayIsCustom) {
      showPlaybookMessage('Duplicate this play to edit its timeline')
      return
    }

    const title = window.prompt('Step title', 'New step')
    if (title === null) {
      return
    }

    const description = window.prompt('Step description optional') ?? undefined
    const nextStep = createStepSnapshot({
      players: currentEditorPlayers,
      positions: courtPositions,
      ballCarrierId: currentBallCarrierId,
      title: title.trim() || 'New step',
      description,
    })
    const nextPlay = {
      ...selectedPlay,
      initialPlayers: currentEditorPlayers,
      steps: [...selectedPlay.steps, nextStep],
    }
    persistUpdatedCustomPlay(nextPlay, nextPlay.steps.length - 1)
    showPlaybookMessage('Step added')
  }

  const handleUpdateStep = () => {
    if (!selectedPlayIsCustom || !activeStep) {
      return
    }

    const nextStep = {
      ...createStepSnapshot({
        players: currentEditorPlayers,
        positions: courtPositions,
        ballCarrierId: currentBallCarrierId,
        title: activeStep.title,
        description: activeStep.description,
      }),
      id: activeStep.id,
      createdAt: activeStep.createdAt,
      updatedAt: new Date().toISOString(),
    }
    const nextPlay = {
      ...selectedPlay,
      initialPlayers: currentEditorPlayers,
      steps: selectedPlay.steps.map((step, index) => (index === activeStepIndex ? nextStep : step)),
    }
    persistUpdatedCustomPlay(nextPlay)
    showPlaybookMessage('Step updated')
  }

  const handleDeleteStep = () => {
    if (!selectedPlayIsCustom || selectedPlay.steps.length <= 1) {
      return
    }

    const confirmed = window.confirm('Delete this step?')
    if (!confirmed) {
      return
    }

    const nextSteps = selectedPlay.steps.filter((_, index) => index !== activeStepIndex)
    const nextStepIndex = Math.max(0, Math.min(activeStepIndex, nextSteps.length - 1))
    const nextPlay = { ...selectedPlay, steps: nextSteps }
    persistUpdatedCustomPlay(nextPlay, nextStepIndex)
    applyCustomStepToEditor(nextPlay, nextStepIndex)
    showPlaybookMessage('Step deleted')
  }

  const handleRenameStep = () => {
    if (!selectedPlayIsCustom || !activeStep) {
      return
    }

    const title = window.prompt('Rename step', activeStep.title)
    if (title === null) {
      return
    }

    const nextTitle = title.trim() || 'New step'
    const nextPlay = {
      ...selectedPlay,
      steps: selectedPlay.steps.map((step, index) => (
        index === activeStepIndex ? { ...step, title: nextTitle, updatedAt: new Date().toISOString() } : step
      )),
    }
    persistUpdatedCustomPlay(nextPlay)
    showPlaybookMessage('Step renamed')
  }

  const handleEditStepDescription = () => {
    if (!selectedPlayIsCustom || !activeStep) {
      return
    }

    const description = window.prompt('Step description', activeStep.description)
    if (description === null) {
      return
    }

    const nextPlay = {
      ...selectedPlay,
      steps: selectedPlay.steps.map((step, index) => (
        index === activeStepIndex ? { ...step, description: description.trim() || 'Saved custom play step.', updatedAt: new Date().toISOString() } : step
      )),
    }
    persistUpdatedCustomPlay(nextPlay)
    showPlaybookMessage('Step description updated')
  }

  const handleSaveAsCustomPlay = () => {
    const name = window.prompt('Name this custom play')
    if (!name) {
      return
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      showPlaybookMessage('Invalid play name')
      return
    }

    const description = window.prompt('Add a short description optional') ?? undefined
    const customPlay = createCustomPlayFromBoard({
      basePlay: selectedPlay,
      name: trimmedName,
      description,
      players: isEditMode ? editedPlayers : selectedPlay.initialPlayers,
      positions: courtPositions,
      ballCarrierId: isEditMode ? ballCarrierId : activeStep?.ballOwnerId ?? activeStep?.ball?.carrierId ?? getBallHandler(selectedPlay)?.id,
    })

    addCustomPlay(customPlay)
    reset()
    resetForPlay(customPlay)
    setSelectedPlayId(customPlay.id)
    saveBoardState(createDefaultStateForPlay(customPlay))
    showPlaybookMessage('Custom play saved')
  }

  const handleDuplicatePlay = () => {
    const defaultName = `${selectedPlay.name} Copy`
    const name = window.prompt('Name the duplicated play', defaultName)
    if (!name) {
      return
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      showPlaybookMessage('Invalid play name')
      return
    }

    const customPlay = duplicatePlayAsCustom(selectedPlay, trimmedName)
    addCustomPlay(customPlay)
    reset()
    resetForPlay(customPlay)
    setSelectedPlayId(customPlay.id)
    saveBoardState(createDefaultStateForPlay(customPlay))
    showPlaybookMessage('Play duplicated')
  }

  const handleDeleteCustomPlay = () => {
    if (!selectedPlayIsCustom) {
      showPlaybookMessage('Cannot delete built-in play')
      return
    }

    const confirmed = window.confirm('Delete this custom play?')
    if (!confirmed) {
      return
    }

    deleteCustomPlay(selectedPlay.id)
    reset()
    resetForPlay(defaultPlay)
    setSelectedPlayId(defaultPlay.id)
    saveBoardState(createDefaultStateForPlay(defaultPlay))
    showPlaybookMessage('Custom play deleted')
  }

  const handleReset = () => {
    if (isEditMode) {
      if (selectedPlayIsCustom) {
        reset()
        applyCustomStepToEditor(selectedPlay, 0)
        return
      }

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
      canDeleteCustomPlay={selectedPlayIsCustom}
      canEditTimeline={selectedPlayIsCustom}
      clearBoardLabel={clearBoardLabel}
      isPlaying={isPlaying}
      isEditMode={isEditMode}
      onAddDefense={() => addPlayer('defense')}
      onAddOffense={() => addPlayer('offense')}
      onAssignBall={assignBallToSelected}
      onClearBoard={handleClearBoard}
      onDeleteCustomPlay={handleDeleteCustomPlay}
      onDuplicatePlay={handleDuplicatePlay}
      onNextStep={handleNextStep}
      onPlayFullSequence={playFullSequence}
      onPreviousStep={handlePreviousStep}
      onReset={handleReset}
      onRemoveSelectedPlayer={removeSelectedPlayer}
      onResetToPlayDefaults={handleResetToPlayDefaults}
      onSaveAsCustomPlay={handleSaveAsCustomPlay}
      onSaveBoard={handleSaveBoard}
      onStepSelect={handleStepSelect}
      onToggleEditMode={toggleEditMode}
      onToggleTheme={toggleTheme}
      playbookMessage={playbookMessage}
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
          canEditTimeline={selectedPlayIsCustom}
          isEditMode={isEditMode}
          onAddStep={handleAddStep}
          onAssignBall={assignBallToSelected}
          onDeleteStep={handleDeleteStep}
          onEditStepDescription={handleEditStepDescription}
          onRenameStep={handleRenameStep}
          onSelectPlay={handleSelectPlay}
          onUpdateStep={handleUpdateStep}
          play={selectedPlay}
          plays={allPlays}
          selectedPlayer={selectedPlayer}
        />
      </motion.div>
    </AppShell>
  )
}

export default App
