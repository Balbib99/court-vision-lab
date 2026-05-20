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
    <div className="min-h-screen overflow-hidden bg-[#0e0e10] text-[#e5e1e4]">
      <TopBar activePlay={activePlay} />
      <div className="flex min-h-[calc(100vh-80px)]">
        <Sidebar />
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative min-h-0 flex-1">{children}</div>
          <div className="pointer-events-none absolute inset-x-4 bottom-5 z-40 md:left-24 md:right-8">
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
