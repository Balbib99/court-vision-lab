import type { ReactNode } from 'react'
import type { Play, PlayStep } from '../../types/play'
import { BottomControls } from './BottomControls'
import { RightToolbar } from './RightToolbar'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

type AppShellProps = {
  activePlay: Play
  activeStep?: PlayStep
  activeStepIndex: number
  children: ReactNode
  isPlaying: boolean
  onPlay: () => void
  onReset: () => void
  stepCount: number
}

export function AppShell({
  activePlay,
  activeStep,
  activeStepIndex,
  children,
  isPlaying,
  onPlay,
  onReset,
  stepCount,
}: AppShellProps) {
  return (
    <div className="app-shell min-h-dvh bg-[#0e0e10] text-[#e5e1e4] xl:overflow-hidden">
      <TopBar activePlay={activePlay} />
      <div className="app-body flex min-h-[calc(100dvh-80px)]">
        <Sidebar />
        <main className="app-main relative flex min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto xl:overflow-hidden">
          <div className="app-content relative min-h-0 flex-1 pb-32 xl:pb-0">{children}</div>
          <div className="bottom-controls-wrap pointer-events-none fixed inset-x-4 bottom-4 z-40 md:left-24 md:right-8 xl:absolute xl:bottom-5">
            <div className="pointer-events-auto">
              <BottomControls
                activeStep={activeStep}
                activeStepIndex={activeStepIndex}
                isPlaying={isPlaying}
                onPlay={onPlay}
                onReset={onReset}
                stepCount={stepCount}
              />
            </div>
          </div>
          <RightToolbar />
        </main>
      </div>
    </div>
  )
}
