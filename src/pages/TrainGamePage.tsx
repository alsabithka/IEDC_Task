import React, { Suspense, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { useTrainControls } from '../components/train-game/controls/useTrainControls'
import { useGameProgress } from '../components/train-game/controls/useGameProgress'
import { useAdaptivePerformance } from '../components/train-game/graphics/useAdaptivePerformance'
import { GameWorld } from '../components/train-game/world/GameWorld'
import { GameHUD } from '../components/train-game/ui/GameHUD'
import { GameStartScreen } from '../components/train-game/ui/GameStartScreen'
import { GamePauseMenu } from '../components/train-game/ui/GamePauseMenu'
import { SessionInfoPanel } from '../components/train-game/stations/SessionInfoPanel'
import { JourneyCompleteOverlay } from '../components/train-game/ui/JourneyCompleteOverlay'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface TrainGamePageProps {
  onReturnToWebsite: () => void
  onRegister?: () => void
}

export const TrainGamePage: React.FC<TrainGamePageProps> = ({
  onReturnToWebsite,
  onRegister,
}) => {
  // Adaptive graphics profiles & hardware detection
  const {
    quality,
    profile,
    setQuality,
    fps,
    frameTimeMs,
    recordFrame,
    showFpsOverlay,
    setShowFpsOverlay,
    autoAdaptiveQuality,
    setAutoAdaptiveQuality,
  } = useAdaptivePerformance()

  // Input handling hook with mobile touch sliders & camera look
  const {
    inputRef,
    setMobileThrottle,
    setSliderThrottle,
    setMobileBrake,
    setCameraLook,
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
    isOvershot,
    overshotStation,
    overshotDistanceMeters,
    reverseToPlatform,
    updatePhysics,
    startEngine,
    restartGame,
    jumpToStation,
    handleTogglePause,
    handleInteract,
    setIsPaused,
    setIsSessionModalOpen,
  } = useGameProgress(inputRef)

  // Attach interactive keyboard callbacks
  const controlsOptions = useMemo(
    () => ({
      onInteract: handleInteract,
      onTogglePause: handleTogglePause,
    }),
    [handleInteract, handleTogglePause]
  )

  useTrainControls(controlsOptions)

  // WebGL context loss recovery
  const [contextLost, setContextLost] = useState<boolean>(false)

  useEffect(() => {
    const handleContextLost = (e: Event) => {
      e.preventDefault()
      setContextLost(true)
    }
    const handleContextRestored = () => {
      setContextLost(false)
    }

    window.addEventListener('webglcontextlost', handleContextLost)
    window.addEventListener('webglcontextrestored', handleContextRestored)

    // Attempt native screen orientation lock to landscape on mobile devices
    const lockLandscape = async () => {
      try {
        if (screen.orientation && 'lock' in screen.orientation) {
          await screen.orientation.lock('landscape')
        }
      } catch {
        // Fallback handled by GameHUD full-screen rotation lock screen
      }
    }
    lockLandscape()

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost)
      window.removeEventListener('webglcontextrestored', handleContextRestored)
      try {
        if (screen.orientation && 'unlock' in screen.orientation) {
          screen.orientation.unlock()
        }
      } catch {
        // Ignored
      }
    }
  }, [])

  // When Grand Terminus is reached (journey completed), switch orientation back to portrait and exit fullscreen
  useEffect(() => {
    if (!isJourneyCompleted) return

    const exitFullscreenAndRestorePortrait = async () => {
      // 1. Exit fullscreen mode if active
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen()
        } else if ((document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
          const docWithWebkit = document as unknown as { webkitExitFullscreen?: () => Promise<void> }
          if (docWithWebkit.webkitExitFullscreen) {
            await docWithWebkit.webkitExitFullscreen()
          }
        }
      } catch {
        // Ignored
      }

      // 2. Switch orientation back to portrait
      try {
        const orientation = screen.orientation as ScreenOrientation & {
          unlock?: () => void
          lock?: (orientation: string) => Promise<void>
        }
        if (typeof orientation?.lock === 'function') {
          await orientation.lock('portrait')
        } else if (typeof orientation?.unlock === 'function') {
          orientation.unlock()
        }
      } catch {
        try {
          const orientation = screen.orientation as ScreenOrientation & { unlock?: () => void }
          if (typeof orientation?.unlock === 'function') {
            orientation.unlock()
          }
        } catch {
          // Ignored
        }
      }
    }

    exitFullscreenAndRestorePortrait()
  }, [isJourneyCompleted])

  // Handle restarting journey from completion screen
  const handleRestartJourney = useCallback(() => {
    restartGame()
    try {
      if (screen.orientation && 'lock' in screen.orientation) {
        screen.orientation.lock('landscape').catch(() => {})
      }
    } catch {
      // Ignored
    }
  }, [restartGame])

  return (
    <div className="fixed inset-0 w-full h-full min-h-full bg-[#60A5FA] text-white overflow-hidden select-none touch-none">
      {/* Fallback for WebGL Context Loss */}
      {contextLost ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/95 text-center">
          <div className="max-w-md rounded-3xl border border-rose-500/50 bg-slate-900 p-8 shadow-2xl">
            <AlertCircle className="h-12 w-12 text-rose-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-black font-sans text-white mb-2 uppercase">
              Graphics Context Suspended
            </h3>
            <p className="text-xs font-mono text-slate-300 mb-6">
              The mobile graphics processor temporarily reset to conserve memory or battery. Tap below to reload.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-lg"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload Journey</span>
            </button>
          </div>
        </div>
      ) : (
        /* 1. Full-Screen 3D Game Canvas with Capped DPR and Profile Quality */
        <Canvas
          shadows={profile.shadows}
          dpr={profile.dpr}
          gl={{
            antialias: quality !== 'low', // Save vertex processing on budget low profile
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          camera={{
            fov: 52,
            near: 0.1,
            far: profile.maxDrawDistance,
          }}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        >
          <Suspense fallback={null}>
            <GameWorld
              dynamics={dynamics}
              activeStationId={activeStation?.id ?? null}
              isAtStation={isAtStation}
              onPhysicsTick={updatePhysics}
              profile={profile}
              inputRef={inputRef}
              onFrameTick={recordFrame}
            />
          </Suspense>
        </Canvas>
      )}

      {/* 2. In-Game HUD (Visible during active gameplay) */}
      {isStarted && !isJourneyCompleted && (
        <GameHUD
          dynamics={dynamics}
          nextStation={nextStation}
          distanceMeters={distanceToNextStation}
          isAtStation={isAtStation}
          isOvershot={isOvershot}
          overshotStation={overshotStation}
          overshotDistanceMeters={overshotDistanceMeters}
          activeStation={activeStation}
          onOpenSessionModal={() => setIsSessionModalOpen(true)}
          onTogglePause={() => setIsPaused((p) => !p)}
          onReturnToWebsite={onReturnToWebsite}
          onReverseToPlatform={reverseToPlatform}
          onMobileThrottle={setMobileThrottle}
          onSliderThrottle={setSliderThrottle}
          onMobileBrake={setMobileBrake}
          onSetCameraLook={setCameraLook}
          onMobileInteract={triggerMobileInteract}
          fps={fps}
          frameTimeMs={frameTimeMs}
          quality={quality}
          showFpsOverlay={showFpsOverlay}
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

      {/* 5. In-Game Pause Menu with Graphics Quality Settings */}
      {isPaused && (
        <GamePauseMenu
          onResume={() => setIsPaused(false)}
          onRestart={restartGame}
          onReturnToWebsite={onReturnToWebsite}
          onJumpToStation={jumpToStation}
          quality={quality}
          onSelectQuality={setQuality}
          showFps={showFpsOverlay}
          onToggleFps={setShowFpsOverlay}
          autoQuality={autoAdaptiveQuality}
          onToggleAutoQuality={setAutoAdaptiveQuality}
        />
      )}

      {/* 6. Journey Completion Ending Sequence */}
      {isJourneyCompleted && (
        <JourneyCompleteOverlay
          onRestart={handleRestartJourney}
          onReturnToWebsite={onReturnToWebsite}
          onRegister={onRegister}
        />
      )}
    </div>
  )
}

export default TrainGamePage
