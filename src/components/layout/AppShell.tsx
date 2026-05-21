import type { ReactNode } from 'react'
import type { Theme } from '../../hooks/useTheme'
import type { DrawingTool, Play, Player, PlayStep } from '../../types/play'
import { BottomControls } from './BottomControls'
import { RightToolbar } from './RightToolbar'
import { Sidebar } from './Sidebar'
import { TopBar, type BoardSaveStatus, type ExportStatus } from './TopBar'

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
  isCoachMode: boolean
  isEditMode: boolean
  onAddDefense: () => void
  onAddOffense: () => void
  onAssignBall: () => void
  onClearBoard: () => void
  onDeleteCustomPlay: () => void
  onDuplicatePlay: () => void
  onEnterCoachMode: () => void
  onExitCoachMode: () => void
  onExportPng: () => void
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
  exportStatus?: ExportStatus
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
  isCoachMode,
  isEditMode,
  onAddDefense,
  onAddOffense,
  onAssignBall,
  onClearBoard,
  onDeleteCustomPlay,
  onDuplicatePlay,
  onEnterCoachMode,
  onExitCoachMode,
  onExportPng,
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
  exportStatus,
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
        exportStatus={exportStatus}
        isCoachMode={isCoachMode}
        onClearBoard={onClearBoard}
        onDeleteCustomPlay={onDeleteCustomPlay}
        onDuplicatePlay={onDuplicatePlay}
        onEnterCoachMode={onEnterCoachMode}
        onExitCoachMode={onExitCoachMode}
        onExportPng={onExportPng}
        onResetToPlayDefaults={onResetToPlayDefaults}
        onSaveAsCustomPlay={onSaveAsCustomPlay}
        onSaveBoard={onSaveBoard}
        playbookMessage={playbookMessage}
        saveStatus={saveStatus}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
      <div className={['app-body flex', isCoachMode ? 'min-h-[calc(100dvh-64px)]' : 'min-h-[calc(100dvh-80px)]'].join(' ')}>
        {!isCoachMode && <Sidebar />}
        <main className="app-main relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto xl:overflow-hidden">
          <div className={['app-content relative min-h-0 flex-1', isCoachMode ? 'pb-24 xl:pb-0' : 'pb-32 xl:pb-0'].join(' ')}>{children}</div>
          <div className={['bottom-controls-wrap pointer-events-none fixed inset-x-4 bottom-4 z-40 xl:absolute xl:bottom-5', isCoachMode ? 'md:left-8 md:right-8' : 'md:left-24 md:right-8'].join(' ')}>
            <div className="pointer-events-auto">
              <BottomControls
                activeStep={activeStep}
                activeStepIndex={activeStepIndex}
                canNavigateInEditMode={canEditTimeline}
                isCoachMode={isCoachMode}
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
          {!isCoachMode && <RightToolbar
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
          />}
        </main>
      </div>
    </div>
  )
}
