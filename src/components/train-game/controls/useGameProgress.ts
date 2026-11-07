import { useState, useRef, useCallback, useEffect } from 'react'
import type { TrainInputState } from './useTrainControls'
import {
  GAME_STATIONS,
  TRAIN_PHYSICS_CONFIG,
  type GameStationConfig,
} from '../../../config/trainGameConfig'

export interface TrainDynamics {
  speedKmh: number
  throttlePercent: number
  brakePercent: number
  trackProgress: number // 0 to 1
  distanceTraveledMeters: number
}

const INITIAL_DYNAMICS: TrainDynamics = {
  speedKmh: 0,
  throttlePercent: 0,
  brakePercent: 0,
  trackProgress: GAME_STATIONS[0].trackProgress, // Start at Station 1 (Departure Station)
  distanceTraveledMeters: 0,
}

export function useGameProgress(inputRef: React.RefObject<TrainInputState>) {
  // Master Game State
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false)
  const [isJourneyCompleted, setIsJourneyCompleted] = useState<boolean>(false)

  // Train Physics & Position Dynamics
  const simRef = useRef<TrainDynamics>({ ...INITIAL_DYNAMICS })

  // Reactive state for UI HUD sync
  const [dynamics, setDynamics] = useState<TrainDynamics>(INITIAL_DYNAMICS)

  // Station tracking state
  const [nextStation, setNextStation] = useState<GameStationConfig>(GAME_STATIONS[1])
  const [distanceToNextStation, setDistanceToNextStation] = useState<number>(55)
  const [activeStation, setActiveStation] = useState<GameStationConfig | null>(GAME_STATIONS[0])
  const [isAtStation, setIsAtStation] = useState<boolean>(true)
  const [visitedStationIds, setVisitedStationIds] = useState<string[]>(['stn-1'])

  // Overshoot recovery tracking
  const [isOvershot, setIsOvershot] = useState<boolean>(false)
  const [overshotStation, setOvershotStation] = useState<GameStationConfig | null>(null)
  const [overshotDistanceMeters, setOvershotDistanceMeters] = useState<number>(0)

  /**
   * 1-Click Reverse Recovery: Repositions the locomotive directly into the safe stopping zone
   */
  const reverseToPlatform = useCallback(() => {
    const target = overshotStation || activeStation || GAME_STATIONS[0]
    simRef.current.trackProgress = target.trackProgress
    simRef.current.speedKmh = 0
    simRef.current.throttlePercent = 0
    simRef.current.brakePercent = 100
    setDynamics({ ...simRef.current })
    setIsAtStation(true)
    setIsOvershot(false)
    setOvershotStation(null)
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

      // 4. Position Progression along Open Track Route
      const speedMs = (sim.speedKmh * 1000) / 3600
      const distanceStepMeters = speedMs * dt
      sim.distanceTraveledMeters += distanceStepMeters

      const progressStep = distanceStepMeters / TRAIN_PHYSICS_CONFIG.trackLengthMeters
      // Clamp progress between track origin (0.015) and terminal buffer stop (0.985)
      sim.trackProgress = Math.max(0.015, Math.min(0.985, sim.trackProgress + progressStep))

      // Terminal Buffer Stop Collision at End of Track: halt forward motion immediately
      if (sim.trackProgress >= 0.984 && sim.speedKmh > 0) {
        sim.speedKmh = 0
        sim.throttlePercent = 0
      }
      // Start of Track Buffer Collision: halt backward motion
      if (sim.trackProgress <= 0.016 && sim.speedKmh < 0) {
        sim.speedKmh = 0
      }

      // 5. Check for Arrival at Final Destination (Station 8 Grand Terminus)
      // REGARDLESS of throttle input, automatically halt train and trigger journey end message
      const stn8 = GAME_STATIONS[7]
      const distToStn8Meters = (stn8.trackProgress - sim.trackProgress) * TRAIN_PHYSICS_CONFIG.trackLengthMeters
      if (
        (Math.abs(distToStn8Meters) <= TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters ||
          sim.trackProgress >= 0.958) &&
        !isJourneyCompleted
      ) {
        sim.speedKmh = 0
        sim.throttlePercent = 0
        sim.brakePercent = 100
        sim.trackProgress = stn8.trackProgress
        setVisitedStationIds((prev) =>
          prev.includes(stn8.id) ? prev : [...prev, stn8.id]
        )
        setIsAtStation(true)
        setActiveStation(stn8)
        setIsOvershot(false)
        setOvershotStation(null)
        setIsSessionModalOpen(false)
        setIsJourneyCompleted(true)
        return sim
      }

      // 6. Station Proximity, Stopping Zone & Overshoot Detection
      let closestStation: GameStationConfig = GAME_STATIONS[GAME_STATIONS.length - 1]
      let minAheadDistMeters = 99999
      let stoppedStation: GameStationConfig | null = null
      let missedStation: GameStationConfig | null = null
      let missedMeters = 0

      for (let i = 0; i < GAME_STATIONS.length; i++) {
        const stn = GAME_STATIONS[i]
        // Distance along open track to this station (positive = ahead, negative = behind)
        const distMeters = (stn.trackProgress - sim.trackProgress) * TRAIN_PHYSICS_CONFIG.trackLengthMeters

        // Ahead station
        if (distMeters >= -TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters && distMeters < minAheadDistMeters) {
          minAheadDistMeters = Math.max(0, distMeters)
          closestStation = stn
        }

        // Platform stopping zone: +-8.5 meters tolerance around designated stop line
        if (Math.abs(distMeters) <= TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters) {
          stoppedStation = stn
        }

        // Overshoot detection: train drove past platform stopping zone by 8.5m - 28m
        if (distMeters < -TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters && distMeters > -28) {
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
        if (stoppedStation.number === 8 && Math.abs(sim.speedKmh) < 1.0 && !isJourneyCompleted) {
          sim.speedKmh = 0
          sim.throttlePercent = 0
          sim.brakePercent = 100
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
    const isTerminal = target.number === 8
    simRef.current = {
      speedKmh: 0,
      throttlePercent: 0,
      brakePercent: isTerminal ? 100 : 0,
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

    if (isTerminal) {
      setVisitedStationIds((prev) =>
        prev.includes(target.id) ? prev : [...prev, target.id]
      )
      setIsJourneyCompleted(true)
    } else {
      setIsJourneyCompleted(false)
      const nextIdx = Math.min(GAME_STATIONS.length - 1, target.number)
      setNextStation(GAME_STATIONS[nextIdx])
    }
  }, [])

  const handleTogglePause = useCallback(() => {
    if (!isStarted || isJourneyCompleted) return
    setIsPaused((prev) => !prev)
  }, [isStarted, isJourneyCompleted])

  const handleInteract = useCallback(() => {
    if (!isStarted || isPaused || isJourneyCompleted) return
    if (isAtStation && activeStation) {
      setIsSessionModalOpen((prev) => !prev)
    }
  }, [isStarted, isPaused, isJourneyCompleted, isAtStation, activeStation])

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

export default useGameProgress
