import type { ReactNode } from 'react'
import type { Theme } from '../../hooks/useTheme'
import type { Play, Player, PlayStep } from '../../types/play'
import { BottomControls } from './BottomControls'
import { RightToolbar } from './RightToolbar'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type AppShellProps = {
  activePlay: Play
  activeStep?: PlayStep
  activeStepIndex: number
  ballCarrierId?: string
  canAddDefense: boolean
  canAddOffense: boolean
  children: ReactNode
  isPlaying: boolean
  isEditMode: boolean
  onAddDefense: () => void
  onAddOffense: () => void
  onAssignBall: () => void
  onRemoveSelectedPlayer: () => void
  onToggleTheme: () => void
  onToggleEditMode: () => void
  onNextStep: () => void
  onPlayFullSequence: () => void
  onPreviousStep: () => void
  onReset: () => void
  onStepSelect: (stepIndex: number) => void
  stepCount: number
  theme: Theme
  selectedPlayer?: Player
}

export function AppShell({
  activePlay,
  activeStep,
  activeStepIndex,
  ballCarrierId,
  canAddDefense,
  canAddOffense,
  children,
  isPlaying,
  isEditMode,
  onAddDefense,
  onAddOffense,
  onAssignBall,
  onRemoveSelectedPlayer,
  onNextStep,
  onPlayFullSequence,
  onPreviousStep,
  onReset,
  onStepSelect,
  stepCount,
  onToggleTheme,
  onToggleEditMode,
  theme,
  selectedPlayer,
}: AppShellProps) {
  return (
    <div className="app-shell app-bg min-h-dvh xl:overflow-hidden">
      <TopBar activePlay={activePlay} theme={theme} onToggleTheme={onToggleTheme} />
      <div className="app-body flex min-h-[calc(100dvh-80px)]">
        <Sidebar />
        <main className="app-main relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto xl:overflow-hidden">
          <div className="app-content relative min-h-0 flex-1 pb-32 xl:pb-0">{children}</div>
          <div className="bottom-controls-wrap pointer-events-none fixed inset-x-4 bottom-4 z-40 md:left-24 md:right-8 xl:absolute xl:bottom-5">
            <div className="pointer-events-auto">
              <BottomControls
                activeStep={activeStep}
                activeStepIndex={activeStepIndex}
                isEditMode={isEditMode}
                isFirstStep={activeStepIndex === 0}
                isLastStep={activeStepIndex === activePlay.steps.length - 1}
                isPlaying={isPlaying}
                onNextStep={onNextStep}
                onPlayFullSequence={onPlayFullSequence}
                onPreviousStep={onPreviousStep}
                onReset={onReset}
                onStepSelect={onStepSelect}
                steps={activePlay.steps}
                stepCount={stepCount}
              />
            </div>
          </div>
          <RightToolbar
            ballCarrierId={ballCarrierId}
            canAddDefense={canAddDefense}
            canAddOffense={canAddOffense}
            isEditMode={isEditMode}
            onAddDefense={onAddDefense}
            onAddOffense={onAddOffense}
            onAssignBall={onAssignBall}
            onRemoveSelectedPlayer={onRemoveSelectedPlayer}
            onToggleEditMode={onToggleEditMode}
            selectedPlayer={selectedPlayer}
          />
        </main>
      </div>
    </div>
  )
}
