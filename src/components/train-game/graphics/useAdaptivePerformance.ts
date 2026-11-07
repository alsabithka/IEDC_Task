import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  type GraphicsQuality,
  type DeviceCapabilities,
  detectDeviceCapabilities,
  getProfileConfig,
  getInitialQuality,
  saveQualityPreference,
} from './graphicsProfiles'

export function useAdaptivePerformance() {
  const [capabilities] = useState<DeviceCapabilities>(() => detectDeviceCapabilities())
  const [quality, setQualityState] = useState<GraphicsQuality>(() => getInitialQuality(capabilities))
  const profile = useMemo(() => getProfileConfig(quality, capabilities), [quality, capabilities])

  const [fps, setFps] = useState<number>(60)
  const [frameTimeMs, setFrameTimeMs] = useState<number>(16.6)
  const [showFpsOverlay, setShowFpsOverlay] = useState<boolean>(false)
  const [autoAdaptiveQuality, setAutoAdaptiveQuality] = useState<boolean>(true)

  // Internal performance counters
  const framesRef = useRef<number[]>([])
  const lastTimeRef = useRef<number>(0)
  const lowFpsCounterRef = useRef<number>(0)
  const qualityRef = useRef<GraphicsQuality>(quality)

  useEffect(() => {
    qualityRef.current = quality
  }, [quality])

  // Quality setter with persistence
  const setQuality = useCallback((newQuality: GraphicsQuality) => {
    setQualityState(newQuality)
    saveQualityPreference(newQuality)
    qualityRef.current = newQuality
    lowFpsCounterRef.current = 0
  }, [])

  /**
   * Called on every frame by useFrame inside Canvas
   */
  const recordFrame = useCallback(
    (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime
        return
      }

      const delta = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      if (delta <= 0 || delta > 1000) return

      const frames = framesRef.current
      frames.push(delta)
      if (frames.length > 90) {
        frames.shift()
      }

      // Check average every ~30 frames (0.5s)
      if (frames.length % 30 === 0 && frames.length >= 30) {
        const sum = frames.reduce((a, b) => a + b, 0)
        const avgDelta = sum / frames.length
        const currentFps = Math.round(1000 / avgDelta)

        setFps(currentFps)
        setFrameTimeMs(Math.round(avgDelta * 10) / 10)

        // Adaptive step-down: if below 27 FPS for consecutive intervals
        if (autoAdaptiveQuality) {
          if (currentFps < 27) {
            lowFpsCounterRef.current += 1
            if (lowFpsCounterRef.current >= 4) {
              // Sustained low FPS: downscale profile
              if (qualityRef.current === 'high') {
                setQuality('medium')
              } else if (qualityRef.current === 'medium') {
                setQuality('low')
              }
              lowFpsCounterRef.current = 0
            }
          } else {
            lowFpsCounterRef.current = Math.max(0, lowFpsCounterRef.current - 1)
          }
        }
      }
    },
    [autoAdaptiveQuality, setQuality]
  )

  return {
    capabilities,
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
  }
}
