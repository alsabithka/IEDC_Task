import { useState, useRef, useCallback, useEffect } from 'react'
import {
  GAME_STATIONS,
  TRAIN_PHYSICS_CONFIG,
} from '../../../config/trainGameConfig'
import type { GameStationConfig } from '../../../config/trainGameConfig'

export interface TrainDynamics {
  speedKmh: number
  throttlePercent: number
  brakePercent: number
  trackProgress: number
  distanceTraveledMeters: number
}

export function useGameProgress(inputRef: React.RefObject<{
  throttleUp: boolean
  throttleDown: boolean
  brake: boolean
  interact: boolean
  pause: boolean
}>) {
  // Game lifecycle states
  const [isStarted, setIsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false)
  const [isJourneyCompleted, setIsJourneyCompleted] = useState(false)

  // Train physical dynamics state (synced for UI at 20Hz, physics runs on frame)
  const [dynamics, setDynamics] = useState<TrainDynamics>({
    speedKmh: 0,
    throttlePercent: 0,
    brakePercent: 0,
    trackProgress: GAME_STATIONS[0].trackProgress,
    distanceTraveledMeters: 0,
  })

  // Station proximity state
  const [nextStation, setNextStation] = useState<GameStationConfig>(GAME_STATIONS[1])
  const [distanceToNextStation, setDistanceToNextStation] = useState<number>(100)
  const [activeStation, setActiveStation] = useState<GameStationConfig | null>(GAME_STATIONS[0])
  const [isAtStation, setIsAtStation] = useState(true)
  const [visitedStationIds, setVisitedStationIds] = useState<string[]>(['stn-1'])

  // Mutable physics simulation values (avoids React re-renders every 16ms)
  const simRef = useRef<TrainDynamics>({
    speedKmh: 0,
    throttlePercent: 0,
    brakePercent: 0,
    trackProgress: GAME_STATIONS[0].trackProgress,
    distanceTraveledMeters: 0,
  })

  // Direct event-based triggers (called from key/touch handlers)
  const handleTogglePause = useCallback(() => {
    setIsPaused((p) => !p)
  }, [])

  const handleInteract = useCallback(() => {
    if (isAtStation && activeStation && !isPaused) {
      setIsSessionModalOpen((open) => !open)
    }
  }, [isAtStation, activeStation, isPaused])

  // Physics simulation update tick (called per frame with delta seconds)
  const updatePhysics = useCallback(
    (delta: number) => {
      if (!isStarted || isPaused || isSessionModalOpen || isJourneyCompleted) {
        return simRef.current
      }

      const input = inputRef.current
      const sim = simRef.current
      const dt = Math.min(delta, 0.1) // clamp delta to prevent tunneling

      // 1. Throttle Control
      if (input.throttleUp) {
        sim.throttlePercent = Math.min(100, sim.throttlePercent + 35 * dt)
      } else if (input.throttleDown) {
        sim.throttlePercent = Math.max(0, sim.throttlePercent - 45 * dt)
      }

      // 2. Brake Control
      if (input.brake) {
        sim.brakePercent = Math.min(100, sim.brakePercent + 90 * dt)
        // Auto-cut throttle when hard braking
        sim.throttlePercent = Math.max(0, sim.throttlePercent - 80 * dt)
      } else {
        sim.brakePercent = Math.max(0, sim.brakePercent - 90 * dt)
      }

      // 3. Tractive Force & Acceleration Physics
      const throttleFactor = sim.throttlePercent / 100
      const brakeFactor = sim.brakePercent / 100

      if (brakeFactor > 0.05) {
        // Active braking
        sim.speedKmh = Math.max(
          0,
          sim.speedKmh - TRAIN_PHYSICS_CONFIG.brakeDecelerationRate * brakeFactor * dt
        )
      } else if (throttleFactor > 0.02) {
        // Acceleration towards terminal speed proportional to throttle
        const targetSpeed = TRAIN_PHYSICS_CONFIG.maxSpeedKmh * throttleFactor
        if (sim.speedKmh < targetSpeed) {
          sim.speedKmh = Math.min(
            targetSpeed,
            sim.speedKmh + TRAIN_PHYSICS_CONFIG.accelerationRate * throttleFactor * dt
          )
        } else {
          // Coasting down to throttle target
          sim.speedKmh = Math.max(
            targetSpeed,
            sim.speedKmh - TRAIN_PHYSICS_CONFIG.naturalFrictionRate * dt
          )
        }
      } else {
        // Natural coasting rolling friction
        sim.speedKmh = Math.max(
          0,
          sim.speedKmh - TRAIN_PHYSICS_CONFIG.naturalFrictionRate * dt
        )
      }

      // 4. Position Progression along Track
      const speedMs = (sim.speedKmh * 1000) / 3600
      const distanceStepMeters = speedMs * dt
      sim.distanceTraveledMeters += distanceStepMeters

      const progressStep = distanceStepMeters / TRAIN_PHYSICS_CONFIG.trackLengthMeters
      sim.trackProgress = ((sim.trackProgress + progressStep) % 1 + 1) % 1

      // 5. Station Proximity & Arrival Detection
      let closestStation: GameStationConfig = GAME_STATIONS[0]
      let minAheadDistMeters = 99999
      let stoppedStation: GameStationConfig | null = null

      for (let i = 0; i < GAME_STATIONS.length; i++) {
        const stn = GAME_STATIONS[i]
        // Positive ahead distance wrapped to [0, 1)
        let forwardDeltaT = stn.trackProgress - sim.trackProgress
        if (forwardDeltaT < -0.05) forwardDeltaT += 1.0

        const distMeters = forwardDeltaT * TRAIN_PHYSICS_CONFIG.trackLengthMeters

        if (distMeters < minAheadDistMeters && distMeters >= -8) {
          minAheadDistMeters = distMeters
          closestStation = stn
        }

        // Platform stopping zone detection (within +- 7 meters)
        let deltaFromPlatform = Math.abs(stn.trackProgress - sim.trackProgress)
        if (deltaFromPlatform > 0.5) deltaFromPlatform = 1.0 - deltaFromPlatform
        const platformDist = deltaFromPlatform * TRAIN_PHYSICS_CONFIG.trackLengthMeters

        if (platformDist <= 8.5) {
          stoppedStation = stn
        }
      }

      setNextStation(closestStation)
      setDistanceToNextStation(Math.max(0, Math.round(minAheadDistMeters)))

      // Check if train is stopped at platform
      const currentlyAtPlatform = stoppedStation !== null && sim.speedKmh < 1.0
      setIsAtStation(currentlyAtPlatform)
      setActiveStation(stoppedStation)

      if (currentlyAtPlatform && stoppedStation) {
        setVisitedStationIds((prev) =>
          prev.includes(stoppedStation.id) ? prev : [...prev, stoppedStation.id]
        )

        // FINAL STATION ARRIVAL CHECK: Station 8 and speed is completely 0
        if (stoppedStation.number === 8 && sim.speedKmh === 0 && !isJourneyCompleted) {
          setIsJourneyCompleted(true)
        }
      }

      return sim
    },
    [isStarted, isPaused, isSessionModalOpen, isJourneyCompleted, inputRef]
  )

  // Sync dynamics to React state at 15Hz for HUD display without lag
  useEffect(() => {
    if (!isStarted) return
    const interval = setInterval(() => {
      setDynamics({ ...simRef.current })
    }, 66)
    return () => clearInterval(interval)
  }, [isStarted])

  const startEngine = useCallback(() => {
    setIsStarted(true)
    setIsPaused(false)
  }, [])

  const restartGame = useCallback(() => {
    simRef.current = {
      speedKmh: 0,
      throttlePercent: 0,
      brakePercent: 0,
      trackProgress: GAME_STATIONS[0].trackProgress,
      distanceTraveledMeters: 0,
    }
    setDynamics({ ...simRef.current })
    setIsStarted(true)
    setIsPaused(false)
    setIsSessionModalOpen(false)
    setIsJourneyCompleted(false)
    setVisitedStationIds(['stn-1'])
    setIsAtStation(true)
    setActiveStation(GAME_STATIONS[0])
    setNextStation(GAME_STATIONS[1])
  }, [])

  const jumpToStation = useCallback((stationNumber: number) => {
    const target = GAME_STATIONS.find((s) => s.number === stationNumber)
    if (!target) return

    simRef.current.trackProgress = target.trackProgress
    simRef.current.speedKmh = 0
    simRef.current.throttlePercent = 0
    simRef.current.brakePercent = 100

    setDynamics({ ...simRef.current })
    setIsAtStation(true)
    setActiveStation(target)
    setIsSessionModalOpen(true)
    setIsPaused(false)

    setVisitedStationIds((prev) =>
      prev.includes(target.id) ? prev : [...prev, target.id]
    )
  }, [])

  return {
    isStarted,
    isPaused,
    isSessionModalOpen,
    isJourneyCompleted,
    dynamics,
    nextStation,
    distanceToNextStation,
    activeStation,
    isAtStation,
    visitedStationIds,
    updatePhysics,
    startEngine,
    restartGame,
    jumpToStation,
    handleTogglePause,
    handleInteract,
    setIsPaused,
    setIsSessionModalOpen,
  }
}
