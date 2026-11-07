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

interface TrackingData {
  nextStation: GameStationConfig
  distanceToNextStation: number
  activeStation: GameStationConfig | null
  isAtStation: boolean
  isOvershot: boolean
  overshotStation: GameStationConfig | null
  overshotDistanceMeters: number
}

const INITIAL_TRACKING: TrackingData = {
  nextStation: GAME_STATIONS[1],
  distanceToNextStation: 55,
  activeStation: GAME_STATIONS[0],
  isAtStation: true,
  isOvershot: false,
  overshotStation: null,
  overshotDistanceMeters: 0,
}

export function useGameProgress(inputRef: React.RefObject<TrainInputState>) {
  // Master Game State
  const [isStarted, setIsStarted] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false)
  const [isJourneyCompleted, setIsJourneyCompleted] = useState<boolean>(false)

  // Train Physics & Position Dynamics
  const simRef = useRef<TrainDynamics>({ ...INITIAL_DYNAMICS })
  const trackingRef = useRef<TrackingData>({ ...INITIAL_TRACKING })

  // Reactive state for UI HUD sync (throttled to 15Hz to eliminate mobile UI render lag)
  const [dynamics, setDynamics] = useState<TrainDynamics>(INITIAL_DYNAMICS)
  const [nextStation, setNextStation] = useState<GameStationConfig>(GAME_STATIONS[1])
  const [distanceToNextStation, setDistanceToNextStation] = useState<number>(55)
  const [activeStation, setActiveStation] = useState<GameStationConfig | null>(GAME_STATIONS[0])
  const [isAtStation, setIsAtStation] = useState<boolean>(true)
  const [visitedStationIds, setVisitedStationIds] = useState<string[]>(['stn-1'])

  // Overshoot recovery tracking
  const [isOvershot, setIsOvershot] = useState<boolean>(false)
  const [overshotStation, setOvershotStation] = useState<GameStationConfig | null>(null)
  const [overshotDistanceMeters, setOvershotDistanceMeters] = useState<number>(0)

  // Pause automatically when browser tab is suspended or hidden (thermal/battery efficiency)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isStarted && !isJourneyCompleted) {
        setIsPaused(true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [isStarted, isJourneyCompleted])

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

    trackingRef.current.isAtStation = true
    trackingRef.current.isOvershot = false
    trackingRef.current.overshotStation = null
    trackingRef.current.activeStation = target
  }, [overshotStation, activeStation])

  /**
   * Main physics integration tick, called by useFrame inside Canvas.
   * Runs at display refresh rate WITHOUT triggering React re-renders every frame.
   */
  const updatePhysics = useCallback(
    (delta: number) => {
      if (!isStarted || isPaused || isSessionModalOpen || isJourneyCompleted) {
        return simRef.current
      }

      const input = inputRef.current
      const sim = simRef.current
      const tracking = trackingRef.current
      // Clamp delta-time to prevent physics tunneling or runaway spikes
      const dt = Math.min(delta, 0.08)

      // 1. Throttle Control (Handles Direct Touch Slider, Buttons, or Keyboard)
      if (input.targetThrottlePercent !== null) {
        // Direct slider input from mobile touch controls
        const target = input.targetThrottlePercent
        const diff = target - sim.throttlePercent
        const maxStep = 95 * dt
        if (Math.abs(diff) <= maxStep) {
          sim.throttlePercent = target
        } else {
          sim.throttlePercent += Math.sign(diff) * maxStep
        }
      } else if (input.throttleUp) {
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
        if (input.targetThrottlePercent !== null) {
          input.targetThrottlePercent = 0
        }
      } else {
        sim.brakePercent = Math.max(0, sim.brakePercent - 95 * dt)
      }

      // 3. Tractive Force & Acceleration Physics (Delta-time normalised)
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

      // 4. Position Progression along Track Route
      const speedMs = (sim.speedKmh * 1000) / 3600
      const distanceStepMeters = speedMs * dt
      sim.distanceTraveledMeters += distanceStepMeters

      const progressStep = distanceStepMeters / TRAIN_PHYSICS_CONFIG.trackLengthMeters
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

      // 5. Final Destination Check (Station 8 Grand Terminus)
      // REGARDLESS of throttle input, automatically halt train and trigger journey end message
      const stn8 = GAME_STATIONS[7]
      const distToStn8Meters =
        (stn8.trackProgress - sim.trackProgress) * TRAIN_PHYSICS_CONFIG.trackLengthMeters

      if (
        (Math.abs(distToStn8Meters) <= TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters ||
          sim.trackProgress >= 0.958) &&
        !isJourneyCompleted
      ) {
        sim.speedKmh = 0
        sim.throttlePercent = 0
        sim.brakePercent = 100
        sim.trackProgress = stn8.trackProgress
        tracking.isAtStation = true
        tracking.activeStation = stn8
        tracking.isOvershot = false
        tracking.overshotStation = null
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

      // 6. Station Proximity, Stopping Zone & Overshoot Calculations in Refs
      let closestStation: GameStationConfig = GAME_STATIONS[GAME_STATIONS.length - 1]
      let minAheadDistMeters = 99999
      let stoppedStation: GameStationConfig | null = null
      let missedStation: GameStationConfig | null = null
      let missedMeters = 0

      for (let i = 0; i < GAME_STATIONS.length; i++) {
        const stn = GAME_STATIONS[i]
        const distMeters =
          (stn.trackProgress - sim.trackProgress) * TRAIN_PHYSICS_CONFIG.trackLengthMeters

        if (
          distMeters >= -TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters &&
          distMeters < minAheadDistMeters
        ) {
          minAheadDistMeters = Math.max(0, distMeters)
          closestStation = stn
        }

        if (Math.abs(distMeters) <= TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters) {
          stoppedStation = stn
        }

        if (
          distMeters < -TRAIN_PHYSICS_CONFIG.stoppingZoneToleranceMeters &&
          distMeters > -28
        ) {
          missedStation = stn
          missedMeters = Math.round(Math.abs(distMeters))
        }
      }

      tracking.nextStation = closestStation
      tracking.distanceToNextStation = Math.max(0, Math.round(minAheadDistMeters))

      const currentlyAtPlatform = stoppedStation !== null && Math.abs(sim.speedKmh) < 1.0
      tracking.isAtStation = currentlyAtPlatform
      tracking.activeStation = stoppedStation

      if (currentlyAtPlatform && stoppedStation) {
        tracking.isOvershot = false
        tracking.overshotStation = null

        // Trigger Station 8 completion when stopped
        if (stoppedStation.number === 8 && !isJourneyCompleted) {
          sim.speedKmh = 0
          sim.throttlePercent = 0
          sim.brakePercent = 100
          setIsJourneyCompleted(true)
          setIsSessionModalOpen(false)
        }
      } else if (missedStation !== null && Math.abs(sim.speedKmh) < 25.0) {
        tracking.isOvershot = true
        tracking.overshotStation = missedStation
        tracking.overshotDistanceMeters = missedMeters
      } else {
        tracking.isOvershot = false
        tracking.overshotStation = null
      }

      return sim
    },
    [isStarted, isPaused, isSessionModalOpen, isJourneyCompleted, inputRef]
  )

  /**
   * Throttled UI State Synchronization (15Hz / ~66ms interval)
   * This completely avoids React state re-rendering overhead on every 60Hz frame!
   */
  useEffect(() => {
    if (!isStarted) return

    const interval = setInterval(() => {
      const tracking = trackingRef.current
      setDynamics({ ...simRef.current })
      setNextStation(tracking.nextStation)
      setDistanceToNextStation(tracking.distanceToNextStation)
      setIsAtStation(tracking.isAtStation)
      setActiveStation(tracking.activeStation)
      setIsOvershot(tracking.isOvershot)
      setOvershotStation(tracking.overshotStation)
      setOvershotDistanceMeters(tracking.overshotDistanceMeters)

      if (tracking.isAtStation && tracking.activeStation) {
        const id = tracking.activeStation.id
        setVisitedStationIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
      }
    }, 66)

    return () => clearInterval(interval)
  }, [isStarted])

  const startEngine = useCallback(() => {
    setIsStarted(true)
    setIsPaused(false)
  }, [])

  const restartGame = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.targetThrottlePercent = 0
      inputRef.current.throttleUp = false
      inputRef.current.throttleDown = false
      inputRef.current.brake = false
    }
    simRef.current = {
      speedKmh: 0,
      throttlePercent: 0,
      brakePercent: 0,
      trackProgress: GAME_STATIONS[0].trackProgress,
      distanceTraveledMeters: 0,
    }
    trackingRef.current = {
      nextStation: GAME_STATIONS[1],
      distanceToNextStation: 55,
      activeStation: GAME_STATIONS[0],
      isAtStation: true,
      isOvershot: false,
      overshotStation: null,
      overshotDistanceMeters: 0,
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
  }, [inputRef])

  const jumpToStation = useCallback((stationNumber: number) => {
    const target = GAME_STATIONS.find((s) => s.number === stationNumber)
    if (!target) return
    const isTerminal = target.number === 8
    if (inputRef.current) {
      inputRef.current.targetThrottlePercent = 0
      inputRef.current.throttleUp = false
      inputRef.current.throttleDown = false
      inputRef.current.brake = false
    }
    simRef.current = {
      speedKmh: 0,
      throttlePercent: 0,
      brakePercent: 100,
      trackProgress: target.trackProgress,
      distanceTraveledMeters: 0,
    }
    trackingRef.current.activeStation = target
    trackingRef.current.isAtStation = true
    trackingRef.current.isOvershot = false
    trackingRef.current.overshotStation = null

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
      trackingRef.current.nextStation = GAME_STATIONS[nextIdx]
    }
  }, [inputRef])

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
