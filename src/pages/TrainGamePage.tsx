import React, { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTrainControls } from '../components/train-game/controls/useTrainControls'
import { useGameProgress } from '../components/train-game/controls/useGameProgress'
import { GameWorld } from '../components/train-game/world/GameWorld'
import { GameHUD } from '../components/train-game/ui/GameHUD'
import { GameStartScreen } from '../components/train-game/ui/GameStartScreen'
import { GamePauseMenu } from '../components/train-game/ui/GamePauseMenu'
import { SessionInfoPanel } from '../components/train-game/stations/SessionInfoPanel'
import { JourneyCompleteOverlay } from '../components/train-game/ui/JourneyCompleteOverlay'

interface TrainGamePageProps {
  onReturnToWebsite: () => void
}

export const TrainGamePage: React.FC<TrainGamePageProps> = ({
  onReturnToWebsite,
}) => {
  // Input handling hook with direct event callbacks
  const {
    inputRef,
    setMobileThrottle,
    setMobileBrake,
    triggerMobileInteract,
  } = useTrainControls()

  // Game physics and progress hook
  const {
    isStarted,
    isPaused,
    isSessionModalOpen,
    isJourneyCompleted,
    dynamics,
    nextStation,
    distanceToNextStation,
    activeStation,
    isAtStation,
    updatePhysics,
    startEngine,
    restartGame,
    jumpToStation,
    handleTogglePause,
    handleInteract,
    setIsPaused,
    setIsSessionModalOpen,
  } = useGameProgress(inputRef)

  // Attach interactive callbacks to input listeners
  const controlsOptions = useMemo(
    () => ({
      onInteract: handleInteract,
      onTogglePause: handleTogglePause,
    }),
    [handleInteract, handleTogglePause]
  )

  // Secondary instance for key callbacks
  useTrainControls(controlsOptions)

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#60A5FA] text-white overflow-hidden select-none">
      {/* 1. Full-Screen 3D Game Canvas */}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        camera={{
          fov: 52, // Standard first-person cab view angle
          near: 0.1,
          far: 240,
        }}
      >
        <Suspense fallback={null}>
          <GameWorld
            dynamics={dynamics}
            activeStationId={activeStation?.id ?? null}
            isAtStation={isAtStation}
            onPhysicsTick={updatePhysics}
          />
        </Suspense>
      </Canvas>

      {/* 2. In-Game HUD (Visible during active gameplay) */}
      {isStarted && (
        <GameHUD
          dynamics={dynamics}
          nextStation={nextStation}
          distanceMeters={distanceToNextStation}
          isAtStation={isAtStation}
          activeStation={activeStation}
          onOpenSessionModal={() => setIsSessionModalOpen(true)}
          onTogglePause={() => setIsPaused((p) => !p)}
          onReturnToWebsite={onReturnToWebsite}
          onMobileThrottle={setMobileThrottle}
          onMobileBrake={setMobileBrake}
          onMobileInteract={triggerMobileInteract}
        />
      )}

      {/* 3. Initial Game Start Screen */}
      {!isStarted && (
        <GameStartScreen
          onStartEngine={startEngine}
          onReturnToWebsite={onReturnToWebsite}
        />
      )}

      {/* 4. Interactive Session Info Panel (When stopped at platform) */}
      {isSessionModalOpen && activeStation && !isJourneyCompleted && (
        <SessionInfoPanel
          station={activeStation}
          onClose={() => setIsSessionModalOpen(false)}
        />
      )}

      {/* 5. In-Game Pause Menu */}
      {isPaused && (
        <GamePauseMenu
          onResume={() => setIsPaused(false)}
          onRestart={restartGame}
          onReturnToWebsite={onReturnToWebsite}
          onJumpToStation={jumpToStation}
        />
      )}

      {/* 6. Journey Completion Ending Sequence (When stopped at Station 8) */}
      {isJourneyCompleted && (
        <JourneyCompleteOverlay
          onRestart={restartGame}
          onReturnToWebsite={onReturnToWebsite}
        />
      )}
    </div>
  )
}

export default TrainGamePage
