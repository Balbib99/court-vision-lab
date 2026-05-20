import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Court } from './components/court/Court'
import { AppShell } from './components/layout/AppShell'
import { PlayDetailsPanel } from './components/plays/PlayDetailsPanel'
import { defaultPlay, plays } from './data/plays'
import { useCourtEditor } from './hooks/useCourtEditor'
import { usePlayAnimation } from './hooks/usePlayAnimation'
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme, toggleTheme } = useTheme()
  const [selectedPlayId, setSelectedPlayId] = useState(defaultPlay.id)
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
    usePlayAnimation(selectedPlay)
  const {
    assignBallToSelected,
    ballCarrierId,
    editedBallPosition,
    editedPositions,
    isEditMode,
    resetEditedPositions,
    resetForPlay,
    selectedPlayer,
    selectedPlayerId,
    selectPlayer,
    toggleEditMode,
    updatePlayerPosition,
  } = useCourtEditor(selectedPlay, pause)
  const courtPositions = isEditMode ? editedPositions : positions
  const courtBallPosition = isEditMode ? editedBallPosition : ballPosition

  const handleSelectPlay = (playId: string) => {
    const nextPlay = plays.find((play) => play.id === playId) ?? defaultPlay
    reset()
    resetForPlay(nextPlay)
    setSelectedPlayId(playId)
  }

  const handleReset = () => {
    if (isEditMode) {
      resetEditedPositions()
      return
    }

    reset()
  }

  return (
    <AppShell
      activePlay={selectedPlay}
      activeStep={activeStep}
      activeStepIndex={activeStepIndex}
      ballCarrierId={ballCarrierId}
      isPlaying={isPlaying}
      isEditMode={isEditMode}
      onAssignBall={assignBallToSelected}
      onNextStep={nextStep}
      onPlayFullSequence={playFullSequence}
      onPreviousStep={previousStep}
      onReset={handleReset}
      onStepSelect={goToStep}
      onToggleEditMode={toggleEditMode}
      onToggleTheme={toggleTheme}
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
