import { useState, useEffect } from 'react'
import { EVENT_CONFIG } from '../data/eventConfig'

export interface CountdownTime {
  days: string
  hours: string
  minutes: string
  seconds: string
  isComplete: boolean
  totalSecondsRemaining: number
}

function computeTimeRemaining(targetDateISO: string): CountdownTime {
  const target = new Date(targetDateISO).getTime()
  const now = Date.now()
  const diff = target - now

  if (isNaN(target) || diff <= 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isComplete: true,
      totalSecondsRemaining: 0,
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isComplete: false,
    totalSecondsRemaining: Math.floor(diff / 1000),
  }
}

/**
 * High-precision countdown timer hook that recalculates time difference every second.
 * Reads the authoritative event timestamp from src/data/eventConfig.ts by default.
 */
export function useCountdown(targetDateISO: string = EVENT_CONFIG.dates.targetCountdownISO): CountdownTime {
  const [timeRemaining, setTimeRemaining] = useState<CountdownTime>(() =>
    computeTimeRemaining(targetDateISO)
  )

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(computeTimeRemaining(targetDateISO))
    }, 1000)

    // Sync on tab visibility change (e.g. user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setTimeRemaining(computeTimeRemaining(targetDateISO))
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [targetDateISO])

  return timeRemaining
}
