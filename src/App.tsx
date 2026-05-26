import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Court } from './components/court/Court'
import { GuidedTour } from './components/help/GuidedTour'
import { HelpCenter } from './components/help/HelpCenter'
import { AppShell } from './components/layout/AppShell'
import type { AppSection } from './components/layout/Sidebar'
import type { BoardSaveStatus } from './components/layout/TopBar'
import { TemplatesModal } from './components/layout/TemplatesModal'
import { PlayDetailsPanel } from './components/plays/PlayDetailsPanel'
import { PlaybookView } from './components/views/PlaybookView'
import { RosterView } from './components/views/RosterView'
import { StatsView } from './components/views/StatsView'
import { defaultPlay, plays } from './data/plays'
import { boardTemplates, type BoardTemplate } from './data/boardTemplates'
import { guideTasks } from './data/guides'
import type { GuideSection } from './data/guides'
import { demoRoster } from './data/roster'
import { useCustomPlays } from './hooks/useCustomPlays'
import { useCourtEditor } from './hooks/useCourtEditor'
import { useExportCourt } from './hooks/useExportCourt'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import { usePlayAnimation } from './hooks/usePlayAnimation'
import { useTheme } from './hooks/useTheme'
import { useUndoRedo } from './hooks/useUndoRedo'
import type { DrawingTool, Play, TacticalAnnotation } from './types/play'
import { createAnnotationId, createCustomPlayFromBoard, createStepSnapshot, duplicatePlayAsCustom, isCustomPlay } from './utils/customPlays'
import { createBoardState, type SavedBoardState } from './utils/boardState'
import { getBallHandler, getInitialPositions } from './utils/positions'
import { loadBoardState, saveBoardState } from './utils/storage'
import { createJsonFileName, createPlaybookExport, createPlayExport, downloadJson, parseImportedPlays } from './utils/playImportExport'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { addCustomPlay, addCustomPlays, customPlays, deleteCustomPlay, updateCustomPlay } = useCustomPlays()
  const allPlays = useMemo(() => [...plays, ...customPlays], [customPlays])
  const [initialBoardState] = useState(() => loadBoardState([...plays, ...customPlays]))
  const [selectedPlayId, setSelectedPlayId] = useState(initialBoardState?.selectedPlayId ?? defaultPlay.id)
  const [saveStatus, setSaveStatus] = useState<BoardSaveStatus>('idle')
  const [playbookMessage, setPlaybookMessage] = useState('')
  const [activeTool, setActiveTool] = useState<DrawingTool>('select')
  const [activeSection, setActiveSection] = useState<AppSection>('board')
  const [isCoachMode, setIsCoachMode] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [activeGuideId, setActiveGuideId] = useState<string>()
  const [activeGuideStepIndex, setActiveGuideStepIndex] = useState(0)
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)
  const [isTacticalPanelCollapsed, setIsTacticalPanelCollapsed] = useState(() => window.localStorage.getItem('court-vision-lab:tactical-panel-collapsed') === 'true')
  const courtExportRef = useRef<HTMLDivElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)
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
    restoreBoardState,
    removeSelectedPlayer,
    selectedPlayer,
    selectedPlayerId,
    selectPlayer,
    toggleEditMode,
    updatePlayerPosition,
  } = useCourtEditor(selectedPlay, pause, initialBoardState)
  type HistorySnapshot = {
    boardState: SavedBoardState
    play?: Play
    selectedPlayId: string
  }
  const selectedPlayIsCustom = isCustomPlay(selectedPlay)
  const activeGuide = useMemo(
    () => guideTasks.find((guide) => guide.id === activeGuideId),
    [activeGuideId],
  )
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

  const history = useUndoRedo<HistorySnapshot>(40)

  const createHistorySnapshot = useCallback((): HistorySnapshot => ({
    boardState: createCurrentBoardState(),
    play: selectedPlayIsCustom ? selectedPlay : undefined,
    selectedPlayId: selectedPlay.id,
  }), [createCurrentBoardState, selectedPlay, selectedPlayIsCustom])

  const restoreHistorySnapshot = useCallback((snapshot: HistorySnapshot) => {
    if (snapshot.play && isCustomPlay(snapshot.play)) {
      updateCustomPlay(snapshot.play)
    }

    setSelectedPlayId(snapshot.selectedPlayId)
    restoreBoardState(snapshot.boardState)
    goToStep(snapshot.boardState.currentStepIndex)
    saveBoardState(snapshot.boardState)
    showPlaybookMessage('History restored')
  }, [goToStep, restoreBoardState, showPlaybookMessage, updateCustomPlay])

  const recordHistory = useCallback(() => {
    history.record(createHistorySnapshot())
  }, [createHistorySnapshot, history])

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

  const handleLoadPlayFromPlaybook = (playId: string) => {
    handleSelectPlay(playId)
    setActiveSection('board')
  }

  const handleToggleTacticalPanel = () => {
    setIsTacticalPanelCollapsed((current) => {
      const next = !current
      window.localStorage.setItem('court-vision-lab:tactical-panel-collapsed', String(next))
      return next
    })
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

  const handleExportJson = () => {
    downloadJson(createPlayExport(selectedPlay), createJsonFileName(selectedPlay.name))
    showPlaybookMessage('JSON exported')
  }

  const handleExportPlaybook = () => {
    downloadJson(createPlaybookExport(customPlays), 'court-vision-lab-playbook-backup.json')
    showPlaybookMessage('Playbook exported')
  }

  const handleImportJsonClick = () => {
    importInputRef.current?.click()
  }

  const handleImportJsonFile = async (file?: File) => {
    if (!file) {
      return
    }

    const result = parseImportedPlays(await file.text(), allPlays)
    if (!result.ok) {
      showPlaybookMessage(result.message)
      return
    }

    addCustomPlays(result.plays)
    const firstPlay = result.plays[0]
    reset()
    resetForPlay(firstPlay)
    setSelectedPlayId(firstPlay.id)
    saveBoardState(createDefaultStateForPlay(firstPlay))
    setActiveSection('board')
    showPlaybookMessage(result.plays.length === 1 ? 'Play imported' : 'Playbook imported')
  }

  const handleUndo = () => {
    const snapshot = history.undo(createHistorySnapshot())
    if (snapshot) {
      restoreHistorySnapshot(snapshot)
    }
  }

  const handleRedo = () => {
    const snapshot = history.redo(createHistorySnapshot())
    if (snapshot) {
      restoreHistorySnapshot(snapshot)
    }
  }

  const handleSelectTool = (tool: DrawingTool) => {
    setActiveTool((currentTool) => (currentTool === tool ? 'select' : tool))
  }

  const handleStartGuide = (guideId: string) => {
    setIsHelpOpen(false)
    setActiveGuideId(guideId)
    setActiveGuideStepIndex(0)
  }

  const handleCloseGuide = () => {
    setActiveGuideId(undefined)
    setActiveGuideStepIndex(0)
  }

  const handleGuideSectionChange = (section: GuideSection) => {
    setActiveSection(section)
  }

  const handleAddPlayer = (team: 'offense' | 'defense') => {
    recordHistory()
    addPlayer(team)
  }

  const handleAssignBall = () => {
    recordHistory()
    assignBallToSelected()
  }

  const handleRemoveSelectedPlayer = () => {
    recordHistory()
    removeSelectedPlayer()
  }

  const handleMovePlayer = (playerId: string, position: { x: number; y: number }) => {
    recordHistory()
    updatePlayerPosition(playerId, position)
  }

  const updateActiveStepAnnotations = (annotations: TacticalAnnotation[], message: string) => {
    if (!selectedPlayIsCustom || !activeStep) {
      return
    }

    recordHistory()
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

    recordHistory()
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

    recordHistory()
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

    recordHistory()
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

    recordHistory()
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

    recordHistory()
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

  const handleDuplicatePlay = (playToDuplicate = selectedPlay) => {
    const defaultName = `${playToDuplicate.name} Copy`
    const name = window.prompt('Name the duplicated play', defaultName)
    if (!name) {
      return
    }

    const trimmedName = name.trim()
    if (!trimmedName) {
      showPlaybookMessage('Invalid play name')
      return
    }

    const customPlay = duplicatePlayAsCustom(playToDuplicate, trimmedName)
    addCustomPlay(customPlay)
    reset()
    resetForPlay(customPlay)
    setSelectedPlayId(customPlay.id)
    saveBoardState(createDefaultStateForPlay(customPlay))
    showPlaybookMessage('Play duplicated')
  }

  const handleDeleteCustomPlay = (playToDelete = selectedPlay) => {
    if (!isCustomPlay(playToDelete)) {
      showPlaybookMessage('Cannot delete built-in play')
      return
    }

    const confirmed = window.confirm('Delete this custom play?')
    if (!confirmed) {
      return
    }

    recordHistory()
    deleteCustomPlay(playToDelete.id)
    reset()
    resetForPlay(defaultPlay)
    setSelectedPlayId(defaultPlay.id)
    saveBoardState(createDefaultStateForPlay(defaultPlay))
    setActiveSection('board')
    showPlaybookMessage('Custom play deleted')
  }

  const handleLoadDemoRosterToCourt = () => {
    recordHistory()
    const offenseRoster = demoRoster.filter((player) => player.status === 'active').slice(0, 5)
    const namedPlayers = selectedPlay.initialPlayers.map((player) => {
      if (player.team !== 'offense') {
        return player
      }

      const rosterIndex = Number(player.label.replace('O', '')) - 1
      const rosterPlayer = offenseRoster[rosterIndex]
      if (!rosterPlayer) {
        return player
      }

      return {
        ...player,
        name: rosterPlayer.name,
        number: rosterPlayer.number,
        role: `${rosterPlayer.position} - ${rosterPlayer.role}`,
        rosterPlayerId: rosterPlayer.id,
        tags: rosterPlayer.tags,
        stats: {
          defense: rosterPlayer.defense,
          finishing: rosterPlayer.finishing,
          passing: rosterPlayer.passing,
          rating: rosterPlayer.rating,
          rebounding: rosterPlayer.rebounding,
          shooting: rosterPlayer.shooting,
          speed: rosterPlayer.speed,
          threePoint: rosterPlayer.threePoint,
        },
      }
    })

    const rosterBoardState = createBoardState({
      selectedPlayId: selectedPlay.id,
      currentStepIndex: activeStepIndex,
      players: namedPlayers,
      positions: getInitialPositions(namedPlayers),
      ballCarrierId: getBallHandler(selectedPlay)?.id,
      isCustom: true,
    })
    restoreBoardState(rosterBoardState)
    saveBoardState(rosterBoardState)
    setActiveSection('board')
    showPlaybookMessage('Demo roster loaded')
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
    recordHistory()
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

    recordHistory()
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

  const handleCreateEmptyBoard = () => {
    recordHistory()
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
    setActiveSection('board')
    showPlaybookMessage('Empty board ready')
  }

  const handleLoadTemplate = (template: BoardTemplate) => {
    const confirmed = !isBoardCustom || window.confirm('Load this template? Unsaved board changes will be replaced.')
    if (!confirmed) {
      return
    }

    recordHistory()
    reset()
    const nextState = createBoardState({
      selectedPlayId: selectedPlay.id,
      currentStepIndex: 0,
      players: template.players,
      positions: getInitialPositions(template.players),
      ballCarrierId: template.ballOwnerId,
      isCustom: true,
    })
    restoreBoardState(nextState)
    saveBoardState(nextState)
    setIsTemplatesOpen(false)
    setActiveSection('board')
    showPlaybookMessage('Template loaded')
  }

  const handleAddCoachingPoint = () => {
    if (!selectedPlayIsCustom) {
      showPlaybookMessage('Duplicate this play to edit notes')
      return
    }

    const note = window.prompt('Coaching point')
    if (!note?.trim()) {
      return
    }

    recordHistory()
    persistUpdatedCustomPlay({
      ...selectedPlay,
      coachingPoints: [...(selectedPlay.coachingPoints ?? []), note.trim()],
    })
    showPlaybookMessage('Coaching point added')
  }

  const handleDeleteCoachingPoint = (index: number) => {
    if (!selectedPlayIsCustom || !selectedPlay.coachingPoints?.[index]) {
      return
    }

    recordHistory()
    persistUpdatedCustomPlay({
      ...selectedPlay,
      coachingPoints: selectedPlay.coachingPoints.filter((_, itemIndex) => itemIndex !== index),
    })
    showPlaybookMessage('Coaching point deleted')
  }

  const handleAddRosterPlayer = () => {
    showPlaybookMessage('Add Player coming soon')
  }

  const canClearBoard = effectiveIsEditMode && editedPlayers.length > 0
  const clearBoardLabel = !effectiveIsEditMode
    ? 'Clear Board available in Edit Mode'
    : editedPlayers.length > 0
      ? 'Clear Board'
      : 'Board is already clear'

  useKeyboardShortcuts({
    canUseDrawingTools,
    onEscape: () => {
      if (activeGuideId) handleCloseGuide()
      else if (isHelpOpen) setIsHelpOpen(false)
      else if (isTemplatesOpen) setIsTemplatesOpen(false)
      else if (isCoachMode) setIsCoachMode(false)
      else setActiveTool('select')
    },
    onNextStep: handleNextStep,
    onPlayPause: playFullSequence,
    onPreviousStep: handlePreviousStep,
    onRedo: handleRedo,
    onSaveBoard: handleSaveBoard,
    onSelectTool: handleSelectTool,
    onUndo: handleUndo,
  })

  return (
    <AppShell
      activeSection={activeSection}
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
      canRedo={history.canRedo}
      canUndo={history.canUndo}
      canUseDrawingTools={canUseDrawingTools}
      clearBoardLabel={clearBoardLabel}
      isPlaying={isPlaying}
      isCoachMode={isCoachMode}
      isEditMode={effectiveIsEditMode}
      exportStatus={exportStatus}
      onAddDefense={() => handleAddPlayer('defense')}
      onAddOffense={() => handleAddPlayer('offense')}
      onAssignBall={handleAssignBall}
      onClearBoard={handleClearBoard}
      onDeleteCustomPlay={handleDeleteCustomPlay}
      onDuplicatePlay={handleDuplicatePlay}
      onEnterCoachMode={handleEnterCoachMode}
      onExitCoachMode={handleExitCoachMode}
      onExportJson={handleExportJson}
      onExportPlaybook={handleExportPlaybook}
      onExportPng={handleExportPng}
      onImportJson={handleImportJsonClick}
      onNextStep={handleNextStep}
      onOpenHelp={() => setIsHelpOpen(true)}
      onOpenTemplates={() => setIsTemplatesOpen(true)}
      onPlayFullSequence={playFullSequence}
      onPreviousStep={handlePreviousStep}
      onRedo={handleRedo}
      onReset={handleReset}
      onRemoveSelectedPlayer={handleRemoveSelectedPlayer}
      onResetToPlayDefaults={handleResetToPlayDefaults}
      onSaveAsCustomPlay={handleSaveAsCustomPlay}
      onSaveBoard={handleSaveBoard}
      onSelectSection={setActiveSection}
      onSelectTool={handleSelectTool}
      onStepSelect={handleStepSelect}
      onToggleEditMode={handleToggleEditMode}
      onToggleTheme={toggleTheme}
      onUndo={handleUndo}
      playbookMessage={playbookMessage}
      saveStatus={saveStatus}
      selectedPlayer={selectedPlayer}
      stepCount={selectedPlay.steps.length}
      theme={theme}
    >
      <input
        ref={importInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(event) => {
          void handleImportJsonFile(event.target.files?.[0])
          event.currentTarget.value = ''
        }}
      />
      <HelpCenter guides={guideTasks} isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} onStartGuide={handleStartGuide} />
      <GuidedTour
        currentStepIndex={activeGuideStepIndex}
        guide={activeGuide}
        onBack={() => setActiveGuideStepIndex((index) => Math.max(0, index - 1))}
        onClose={handleCloseGuide}
        onNext={() => setActiveGuideStepIndex((index) => Math.min((activeGuide?.steps.length ?? 1) - 1, index + 1))}
        onSectionChange={handleGuideSectionChange}
      />
      <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} onLoadTemplate={handleLoadTemplate} templates={boardTemplates} />
      {activeSection === 'board' ? <motion.div
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
            isTacticalPanelCollapsed={isTacticalPanelCollapsed}
            onCreateAnnotation={handleCreateAnnotation}
            onEraseAnnotation={handleEraseAnnotation}
            onMovePlayer={handleMovePlayer}
            onSelectPlayer={selectPlayer}
            players={effectiveIsEditMode ? editedPlayers : undefined}
            selectedPlayerId={selectedPlayerId}
          />
        </div>
        {!isCoachMode && !isTacticalPanelCollapsed && <PlayDetailsPanel
          activeStep={activeStep}
          activeStepIndex={activeStepIndex}
          activeTool={activeTool}
          ballCarrierId={ballCarrierId}
          canEditTimeline={selectedPlayIsCustom}
          isCollapsed={isTacticalPanelCollapsed}
          onAddCoachingPoint={handleAddCoachingPoint}
          onClearStepAnnotations={handleClearStepAnnotations}
          onDeleteCoachingPoint={handleDeleteCoachingPoint}
          isEditMode={isEditMode}
          onAddStep={handleAddStep}
          onAssignBall={handleAssignBall}
          onDeleteStep={handleDeleteStep}
          onEditStepDescription={handleEditStepDescription}
          onRenameStep={handleRenameStep}
          onSelectTool={handleSelectTool}
          onToggleCollapsed={handleToggleTacticalPanel}
          onSelectPlay={handleSelectPlay}
          onUpdateStep={handleUpdateStep}
          play={selectedPlay}
          plays={allPlays}
          selectedPlayer={selectedPlayer}
        />}
        {!isCoachMode && isTacticalPanelCollapsed && (
          <button
            type="button"
            onClick={handleToggleTacticalPanel}
            className="panel-floating accent-text absolute left-3 top-3 z-30 rounded-md border px-2.5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] transition hover:bg-[var(--accent-muted)] md:left-5 md:top-5"
            aria-label="Expand tactical panel"
            title="Expand tactical panel"
          >
            Expand Panel
          </button>
        )}
      </motion.div> : activeSection === 'playbook' ? (
        <PlaybookView
          builtInPlays={plays}
          customPlays={customPlays}
          onCreateEmptyBoard={handleCreateEmptyBoard}
          selectedPlayId={selectedPlay.id}
          onDeletePlay={handleDeleteCustomPlay}
          onDuplicatePlay={handleDuplicatePlay}
          onLoadPlay={handleLoadPlayFromPlaybook}
        />
      ) : activeSection === 'roster' ? (
        <RosterView players={demoRoster} onAddPlayer={handleAddRosterPlayer} onLoadRosterToCourt={handleLoadDemoRosterToCourt} />
      ) : (
        <StatsView players={demoRoster} />
      )}
    </AppShell>
  )
}

export default App
