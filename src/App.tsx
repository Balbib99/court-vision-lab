import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Court } from './components/court/Court'
import { AppShell } from './components/layout/AppShell'
import { PlayDetailsPanel } from './components/plays/PlayDetailsPanel'
import { defaultPlay, plays } from './data/plays'
import { usePlayAnimation } from './hooks/usePlayAnimation'

function App() {
  const [selectedPlayId, setSelectedPlayId] = useState(defaultPlay.id)
  const selectedPlay = useMemo(
    () => plays.find((play) => play.id === selectedPlayId) ?? defaultPlay,
    [selectedPlayId],
  )
  const { activeStep, activeStepIndex, ballPosition, isPlaying, playAnimation, positions, reset } =
    usePlayAnimation(selectedPlay)

  const handleSelectPlay = (playId: string) => {
    reset()
    setSelectedPlayId(playId)
  }

  return (
    <AppShell
      activePlay={selectedPlay}
      activeStep={activeStep}
      activeStepIndex={activeStepIndex}
      isPlaying={isPlaying}
      onPlay={playAnimation}
      onReset={reset}
      stepCount={selectedPlay.steps.length}
    >
      <motion.div
        className="relative flex min-h-[calc(100vh-80px)] flex-col xl:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Court
          play={selectedPlay}
          positions={positions}
          ballPosition={ballPosition}
          activeStep={activeStep}
          activeStepIndex={activeStepIndex}
        />
        <PlayDetailsPanel
          activeStep={activeStep}
          activeStepIndex={activeStepIndex}
          onSelectPlay={handleSelectPlay}
          play={selectedPlay}
          plays={plays}
        />
      </motion.div>
    </AppShell>
  )
}

export default App
