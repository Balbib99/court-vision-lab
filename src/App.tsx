import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Court } from './components/court/Court'
import { AppShell } from './components/layout/AppShell'
import type { BoardSaveStatus } from './components/layout/TopBar'
import { PlayDetailsPanel } from './components/plays/PlayDetailsPanel'
import { defaultPlay, plays } from './data/plays'
import { useCustomPlays } from './hooks/useCustomPlays'
import { useCourtEditor } from './hooks/useCourtEditor'
import { useExportCourt } from './hooks/useExportCourt'
import { usePlayAnimation } from './hooks/usePlayAnimation'
import { useTheme } from './hooks/useTheme'
import type { DrawingTool, TacticalAnnotation } from './types/play'
import { createAnnotationId, createCustomPlayFromBoard, createStepSnapshot, duplicatePlayAsCustom, isCustomPlay } from './utils/customPlays'
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
  const [activeTool, setActiveTool] = useState<DrawingTool>('select')
  const [isCoachMode, setIsCoachMode] = useState(false)
  const courtExportRef = useRef<HTMLDivElement>(null)
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
  const selectedPlayIsCustom = isCustomPlay(selectedPlay)
  const effectiveIsEditMode = isEditMode && !isCoachMode
  const courtPositions = effectiveIsEditMode ? editedPositions : positions
  const courtBallPosition = effectiveIsEditMode ? editedBallPosition : ballPosition
  const canUseDrawingTools = effectiveIsEditMode && selectedPlayIsCustom
  const currentEditorPlayers = effectiveIsEditMode ? editedPlayers : selectedPlay.initialPlayers
  const currentBallCarrierId = effectiveIsEditMode ? ballCarrierId : activeStep?.ballOwnerId ?? activeStep?.ball?.carrierId ?? getBallHandler(selectedPlay)?.id
  const { exportCourt, exportStatus } = useExportCourt()

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
      players: effectiveIsEditMode ? editedPlayers : selectedPlay.initialPlayers,
      positions: effectiveIsEditMode ? editedPositions : positions,
      ballCarrierId: effectiveIsEditMode ? ballCarrierId : playBallCarrierId,
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
    effectiveIsEditMode,
    positions,
    selectedPlay,
  ])

  const handleSaveBoard = useCallback(() => {
    saveBoardState(createCurrentBoardState())
    showSaveFeedback('saved')
  }, [createCurrentBoardState, showSaveFeedback])

  useEffect(() => {
    if (!effectiveIsEditMode) {
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
  }, [createCurrentBoardState, effectiveIsEditMode, showSaveFeedback])

  useEffect(() => {
    if (!isCoachMode) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCoachMode(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCoachMode])

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
    if (selectedPlayIsCustom && effectiveIsEditMode) {
      const stepIndex = Math.max(activeStepIndex - 1, 0)
      goToStep(stepIndex)
      applyCustomStepToEditor(selectedPlay, stepIndex)
      return
    }

    previousStep()
  }

  const handleNextStep = () => {
    if (selectedPlayIsCustom && effectiveIsEditMode) {
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

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setActiveTool('select')
    }

    toggleEditMode()
  }

  const handleEnterCoachMode = () => {
    pause()
    setActiveTool('select')
    setIsCoachMode(true)
  }

  const handleExitCoachMode = () => {
    setIsCoachMode(false)
  }

  const handleExportPng = () => {
    void exportCourt(courtExportRef.current, selectedPlay.name, activeStepIndex)
  }

  const handleSelectTool = (tool: DrawingTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? 'select' : tool))
  }

  const updateActiveStepAnnotations = (annotations: TacticalAnnotation[], message: string) => {
    if (!selectedPlayIsCustom || !activeStep) {
      return
    }

    const nextPlay = {
      ...selectedPlay,
      steps: selectedPlay.steps.map((step, index) => (
        index === activeStepIndex ? { ...step, annotations, updatedAt: new Date().toISOString() } : step
      )),
    }
    persistUpdatedCustomPlay(nextPlay)
    showPlaybookMessage(message)
  }

  const handleCreateAnnotation = (annotation: Omit<TacticalAnnotation, 'id' | 'createdAt'>) => {
    if (!canUseDrawingTools || !activeStep) {
      if (!selectedPlayIsCustom) {
        showPlaybookMessage('Duplicate this play to edit annotations')
      }
      return
    }

    updateActiveStepAnnotations([
      ...(activeStep.annotations ?? []),
      {
        ...annotation,
        id: createAnnotationId(annotation.type),
        createdAt: new Date().toISOString(),
      },
    ], 'Annotation added')
  }

  const handleEraseAnnotation = (annotationId: string) => {
    if (!canUseDrawingTools || !activeStep) {
      return
    }

    updateActiveStepAnnotations(
      (activeStep.annotations ?? []).filter((annotation) => annotation.id !== annotationId),
      'Annotation erased',
    )
  }

  const handleClearStepAnnotations = () => {
    if (!canUseDrawingTools || !activeStep || (activeStep.annotations ?? []).length === 0) {
      return
    }

    const confirmed = window.confirm('Clear annotations for this step?')
    if (!confirmed) {
      return
    }

    updateActiveStepAnnotations([], 'Annotations cleared')
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
      annotations: activeStep.annotations,
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
      players: effectiveIsEditMode ? editedPlayers : selectedPlay.initialPlayers,
      positions: courtPositions,
      ballCarrierId: effectiveIsEditMode ? ballCarrierId : activeStep?.ballOwnerId ?? activeStep?.ball?.carrierId ?? getBallHandler(selectedPlay)?.id,
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
    if (effectiveIsEditMode) {
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
    if (!effectiveIsEditMode || editedPlayers.length === 0) {
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

  const canClearBoard = effectiveIsEditMode && editedPlayers.length > 0
  const clearBoardLabel = !effectiveIsEditMode
    ? 'Clear Board available in Edit Mode'
    : editedPlayers.length > 0
      ? 'Clear Board'
      : 'Board is already clear'

  return (
    <AppShell
      activeTool={activeTool}
      activePlay={selectedPlay}
      activeStep={activeStep}
      activeStepIndex={activeStepIndex}
      ballCarrierId={ballCarrierId}
      canAddDefense={canAddDefense}
      canAddOffense={canAddOffense}
      canClearBoard={canClearBoard}
      canDeleteCustomPlay={selectedPlayIsCustom}
      canEditTimeline={selectedPlayIsCustom}
      canUseDrawingTools={canUseDrawingTools}
      clearBoardLabel={clearBoardLabel}
      isPlaying={isPlaying}
      isCoachMode={isCoachMode}
      isEditMode={effectiveIsEditMode}
      exportStatus={exportStatus}
      onAddDefense={() => addPlayer('defense')}
      onAddOffense={() => addPlayer('offense')}
      onAssignBall={assignBallToSelected}
      onClearBoard={handleClearBoard}
      onDeleteCustomPlay={handleDeleteCustomPlay}
      onDuplicatePlay={handleDuplicatePlay}
      onEnterCoachMode={handleEnterCoachMode}
      onExitCoachMode={handleExitCoachMode}
      onExportPng={handleExportPng}
      onNextStep={handleNextStep}
      onPlayFullSequence={playFullSequence}
      onPreviousStep={handlePreviousStep}
      onReset={handleReset}
      onRemoveSelectedPlayer={removeSelectedPlayer}
      onResetToPlayDefaults={handleResetToPlayDefaults}
      onSaveAsCustomPlay={handleSaveAsCustomPlay}
      onSaveBoard={handleSaveBoard}
      onSelectTool={handleSelectTool}
      onStepSelect={handleStepSelect}
      onToggleEditMode={handleToggleEditMode}
      onToggleTheme={toggleTheme}
      playbookMessage={playbookMessage}
      saveStatus={saveStatus}
      selectedPlayer={selectedPlayer}
      stepCount={selectedPlay.steps.length}
      theme={theme}
    >
      <motion.div
        className={['relative flex flex-col xl:block', isCoachMode ? 'min-h-[calc(100dvh-64px)]' : 'min-h-[calc(100vh-80px)]'].join(' ')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <div ref={courtExportRef} className={isCoachMode ? 'coach-export-target flex min-h-[calc(100dvh-160px)] items-center' : undefined}>
          <Court
            play={selectedPlay}
            positions={courtPositions}
            ballPosition={courtBallPosition}
            activeStep={activeStep}
            activeStepIndex={activeStepIndex}
            activeTool={activeTool}
            annotations={activeStep?.annotations}
            ballCarrierId={effectiveIsEditMode ? ballCarrierId : undefined}
            canEditAnnotations={canUseDrawingTools}
            isCoachMode={isCoachMode}
            isEditMode={effectiveIsEditMode}
            onCreateAnnotation={handleCreateAnnotation}
            onEraseAnnotation={handleEraseAnnotation}
            onMovePlayer={updatePlayerPosition}
            onSelectPlayer={selectPlayer}
            players={effectiveIsEditMode ? editedPlayers : undefined}
            selectedPlayerId={selectedPlayerId}
          />
        </div>
        {!isCoachMode && <PlayDetailsPanel
          activeStep={activeStep}
          activeStepIndex={activeStepIndex}
          activeTool={activeTool}
          ballCarrierId={ballCarrierId}
          canEditTimeline={selectedPlayIsCustom}
          onClearStepAnnotations={handleClearStepAnnotations}
          isEditMode={isEditMode}
          onAddStep={handleAddStep}
          onAssignBall={assignBallToSelected}
          onDeleteStep={handleDeleteStep}
          onEditStepDescription={handleEditStepDescription}
          onRenameStep={handleRenameStep}
          onSelectTool={handleSelectTool}
          onSelectPlay={handleSelectPlay}
          onUpdateStep={handleUpdateStep}
          play={selectedPlay}
          plays={allPlays}
          selectedPlayer={selectedPlayer}
        />}
      </motion.div>
    </AppShell>
  )
}

export default App
