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
  const [distanceToNextStation, setDistanceToNextStation] = useState<number>(56)
  const [activeStation, setActiveStation] = useState<GameStationConfig | null>(GAME_STATIONS[0])
  const [isAtStation, setIsAtStation] = useState(true)
  const [isOvershot, setIsOvershot] = useState(false)
  const [overshotStation, setOvershotStation] = useState<GameStationConfig | null>(null)
  const [overshotDistanceMeters, setOvershotDistanceMeters] = useState(0)
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
      setIsSessionModalOpen(true)
    }
  }, [isAtStation, activeStation, isPaused])

  // One-click recovery mechanism to reverse back into designated platform stopping zone
  const reverseToPlatform = useCallback(() => {
    const target = overshotStation || activeStation
    if (!target) return
    simRef.current = {
      speedKmh: 0,
      throttlePercent: 0,
      brakePercent: 0,
      trackProgress: target.trackProgress,
      distanceTraveledMeters: simRef.current.distanceTraveledMeters,
    }
    setDynamics({ ...simRef.current })
    setIsAtStation(true)
    setIsOvershot(false)
    setActiveStation(target)
  }, [overshotStation, activeStation])

  /**
   * Main physics integration tick, called by useFrame inside Canvas
   */
  const updatePhysics = useCallback(
    (delta: number) => {
      if (!isStarted || isPaused || isSessionModalOpen || isJourneyCompleted) {
        return simRef.current
      }

      const input = inputRef.current
      const sim = simRef.current
      const dt = Math.min(delta, 0.1) // clamp delta to prevent tunneling

      // 1. Throttle & Reverse Control
      if (input.throttleUp) {
        if (sim.speedKmh < 0) {
          // Braking out of reverse
          sim.speedKmh = Math.min(0, sim.speedKmh + 28 * dt)
        } else {
          sim.throttlePercent = Math.min(100, sim.throttlePercent + 38 * dt)
        }
      } else if (input.throttleDown) {
        if (sim.speedKmh <= 0.8 && sim.throttlePercent <= 2) {
          // Reversing when stopped / near stopped
          sim.speedKmh = Math.max(
            -TRAIN_PHYSICS_CONFIG.maxReverseSpeedKmh,
            sim.speedKmh - 12 * dt
          )
        } else {
          sim.throttlePercent = Math.max(0, sim.throttlePercent - 50 * dt)
        }
      }

      // 2. Brake Control
      if (input.brake) {
        sim.brakePercent = Math.min(100, sim.brakePercent + 95 * dt)
        sim.throttlePercent = Math.max(0, sim.throttlePercent - 85 * dt)
      } else {
        sim.brakePercent = Math.max(0, sim.brakePercent - 95 * dt)
      }

      // 3. Tractive Force & Acceleration Physics
      const throttleFactor = sim.throttlePercent / 100
      const brakeFactor = sim.brakePercent / 100

      if (brakeFactor > 0.05) {
        // Active braking (forward or reverse)
        if (sim.speedKmh > 0) {
          sim.speedKmh = Math.max(
            0,
            sim.speedKmh - TRAIN_PHYSICS_CONFIG.brakeDecelerationRate * brakeFactor * dt
          )
        } else if (sim.speedKmh < 0) {
          sim.speedKmh = Math.min(
            0,
            sim.speedKmh + TRAIN_PHYSICS_CONFIG.brakeDecelerationRate * brakeFactor * dt
          )
        }
      } else if (throttleFactor > 0.02) {
        // Forward acceleration towards target speed
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
      } else if (sim.speedKmh > 0) {
        // Natural forward coasting friction
        sim.speedKmh = Math.max(
          0,
          sim.speedKmh - TRAIN_PHYSICS_CONFIG.naturalFrictionRate * dt
        )
      } else if (sim.speedKmh < 0 && !input.throttleDown) {
        // Natural reverse coasting friction
        sim.speedKmh = Math.min(
          0,
          sim.speedKmh + TRAIN_PHYSICS_CONFIG.naturalFrictionRate * 1.5 * dt
        )
      }

      // 4. Position Progression along Track
      const speedMs = (sim.speedKmh * 1000) / 3600
      const distanceStepMeters = speedMs * dt
      sim.distanceTraveledMeters += distanceStepMeters

      const progressStep = distanceStepMeters / TRAIN_PHYSICS_CONFIG.trackLengthMeters
      sim.trackProgress = ((sim.trackProgress + progressStep) % 1 + 1) % 1

      // 5. Station Proximity, Stopping Zone & Overshoot Detection
      let closestStation: GameStationConfig = GAME_STATIONS[0]
      let minAheadDistMeters = 99999
      let stoppedStation: GameStationConfig | null = null
      let missedStation: GameStationConfig | null = null
      let missedMeters = 0

      for (let i = 0; i < GAME_STATIONS.length; i++) {
        const stn = GAME_STATIONS[i]
        // Shortest signed angular delta on the closed loop
        let deltaT = stn.trackProgress - sim.trackProgress
        if (deltaT < -0.5) deltaT += 1.0
        if (deltaT > 0.5) deltaT -= 1.0

        const distMeters = deltaT * TRAIN_PHYSICS_CONFIG.trackLengthMeters

        // Ahead station
        if (distMeters >= -1.0 && distMeters < minAheadDistMeters) {
          minAheadDistMeters = Math.max(0, distMeters)
          closestStation = stn
        }

        // Platform stopping zone: +-8.5 meters tolerance around designated stop line
        if (Math.abs(distMeters) <= TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters) {
          stoppedStation = stn
        }

        // Overshoot detection: train drove past platform stopping zone by 8.5m - 32m
        if (distMeters < -TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters && distMeters > -32) {
          missedStation = stn
          missedMeters = Math.round(Math.abs(distMeters))
        }
      }

      setNextStation(closestStation)
      setDistanceToNextStation(Math.max(0, Math.round(minAheadDistMeters)))

      // Check if train is stopped at platform
      const currentlyAtPlatform = stoppedStation !== null && Math.abs(sim.speedKmh) < 1.0
      setIsAtStation(currentlyAtPlatform)
      setActiveStation(stoppedStation)

      if (currentlyAtPlatform && stoppedStation) {
        setIsOvershot(false)
        setOvershotStation(null)
        setVisitedStationIds((prev) =>
          prev.includes(stoppedStation.id) ? prev : [...prev, stoppedStation.id]
        )

        // FINAL STATION ARRIVAL CHECK: Station 8 and speed is stopped
        if (stoppedStation.number === 8 && Math.abs(sim.speedKmh) < 0.8 && !isJourneyCompleted) {
          setIsJourneyCompleted(true)
          setIsSessionModalOpen(false)
        }
      } else if (missedStation !== null && Math.abs(sim.speedKmh) < 25.0) {
        setIsOvershot(true)
        setOvershotStation(missedStation)
        setOvershotDistanceMeters(missedMeters)
      } else {
        setIsOvershot(false)
        setOvershotStation(null)
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
    setIsOvershot(false)
    setOvershotStation(null)
    setActiveStation(GAME_STATIONS[0])
    setNextStation(GAME_STATIONS[1])
  }, [])

  const jumpToStation = useCallback((stationNumber: number) => {
    const target = GAME_STATIONS.find((s) => s.number === stationNumber)
    if (!target) return
    simRef.current = {
      speedKmh: 0,
      throttlePercent: 0,
      brakePercent: 0,
      trackProgress: target.trackProgress,
      distanceTraveledMeters: 0,
    }
    setDynamics({ ...simRef.current })
    setIsStarted(true)
    setIsPaused(false)
    setIsSessionModalOpen(false)
    setIsAtStation(true)
    setIsOvershot(false)
    setOvershotStation(null)
    setActiveStation(target)

    const nextIdx = target.number % GAME_STATIONS.length
    setNextStation(GAME_STATIONS[nextIdx])
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
    isOvershot,
    overshotStation,
    overshotDistanceMeters,
    visitedStationIds,
    updatePhysics,
    startEngine,
    restartGame,
    jumpToStation,
    reverseToPlatform,
    handleTogglePause,
    handleInteract,
    setIsPaused,
    setIsSessionModalOpen,
  }
}
