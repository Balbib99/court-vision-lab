import type { ReactNode } from 'react'
import type { Theme } from '../../hooks/useTheme'
import type { DrawingTool, Play, Player, PlayStep } from '../../types/play'
import { BottomControls } from './BottomControls'
import { RightToolbar } from './RightToolbar'
import { Sidebar } from './Sidebar'
import { TopBar, type BoardSaveStatus } from './TopBar'

type AppShellProps = {
  activePlay: Play
  activeStep?: PlayStep
  activeStepIndex: number
  activeTool: DrawingTool
  ballCarrierId?: string
  canAddDefense: boolean
  canAddOffense: boolean
  canClearBoard: boolean
  canDeleteCustomPlay: boolean
  canEditTimeline: boolean
  canUseDrawingTools: boolean
  clearBoardLabel: string
  children: ReactNode
  isPlaying: boolean
  isEditMode: boolean
  onAddDefense: () => void
  onAddOffense: () => void
  onAssignBall: () => void
  onClearBoard: () => void
  onDeleteCustomPlay: () => void
  onDuplicatePlay: () => void
  onRemoveSelectedPlayer: () => void
  onResetToPlayDefaults: () => void
  onSaveAsCustomPlay: () => void
  onSaveBoard: () => void
  onSelectTool: (tool: DrawingTool) => void
  onToggleTheme: () => void
  onToggleEditMode: () => void
  onNextStep: () => void
  onPlayFullSequence: () => void
  onPreviousStep: () => void
  onReset: () => void
  onStepSelect: (stepIndex: number) => void
  stepCount: number
  theme: Theme
  playbookMessage?: string
  saveStatus?: BoardSaveStatus
  selectedPlayer?: Player
}

export function AppShell({
  activePlay,
  activeStep,
  activeStepIndex,
  activeTool,
  ballCarrierId,
  canAddDefense,
  canAddOffense,
  canClearBoard,
  canDeleteCustomPlay,
  canEditTimeline,
  canUseDrawingTools,
  clearBoardLabel,
  children,
  isPlaying,
  isEditMode,
  onAddDefense,
  onAddOffense,
  onAssignBall,
  onClearBoard,
  onDeleteCustomPlay,
  onDuplicatePlay,
  onRemoveSelectedPlayer,
  onResetToPlayDefaults,
  onSaveAsCustomPlay,
  onSaveBoard,
  onSelectTool,
  onNextStep,
  onPlayFullSequence,
  onPreviousStep,
  onReset,
  onStepSelect,
  stepCount,
  playbookMessage,
  saveStatus,
  onToggleTheme,
  onToggleEditMode,
  theme,
  selectedPlayer,
}: AppShellProps) {
  return (
    <div className="app-shell app-bg min-h-dvh xl:overflow-hidden">
      <TopBar
        activePlay={activePlay}
        canClearBoard={canClearBoard}
        canDeleteCustomPlay={canDeleteCustomPlay}
        clearBoardLabel={clearBoardLabel}
        onClearBoard={onClearBoard}
        onDeleteCustomPlay={onDeleteCustomPlay}
        onDuplicatePlay={onDuplicatePlay}
        onResetToPlayDefaults={onResetToPlayDefaults}
        onSaveAsCustomPlay={onSaveAsCustomPlay}
        onSaveBoard={onSaveBoard}
        playbookMessage={playbookMessage}
        saveStatus={saveStatus}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <div className="app-body flex min-h-[calc(100dvh-80px)]">
        <Sidebar />
        <main className="app-main relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto xl:overflow-hidden">
          <div className="app-content relative min-h-0 flex-1 pb-32 xl:pb-0">{children}</div>
          <div className="bottom-controls-wrap pointer-events-none fixed inset-x-4 bottom-4 z-40 md:left-24 md:right-8 xl:absolute xl:bottom-5">
            <div className="pointer-events-auto">
              <BottomControls
                activeStep={activeStep}
                activeStepIndex={activeStepIndex}
                canNavigateInEditMode={canEditTimeline}
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
            activeTool={activeTool}
            ballCarrierId={ballCarrierId}
            canAddDefense={canAddDefense}
            canAddOffense={canAddOffense}
            canUseDrawingTools={canUseDrawingTools}
            isEditMode={isEditMode}
            onAddDefense={onAddDefense}
            onAddOffense={onAddOffense}
            onAssignBall={onAssignBall}
            onRemoveSelectedPlayer={onRemoveSelectedPlayer}
            onSelectTool={onSelectTool}
            onToggleEditMode={onToggleEditMode}
            selectedPlayer={selectedPlayer}
          />
        </main>
      </div>
    </div>
  )
}
