import { useState, useEffect } from 'react'

export interface CountdownTime {
  days: string
  hours: string
  minutes: string
  seconds: string
  isComplete: boolean
  totalSecondsRemaining: number
}

/**
 * High-precision countdown timer hook that recalculates time difference every second.
 * Supports timezone-aware ISO string formats and ensures leading zeros.
 */
export function useCountdown(targetDateISO: string): CountdownTime {
  const calculateTimeRemaining = (): CountdownTime => {
    const target = new Date(targetDateISO).getTime()
    const now = new Date().getTime()
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

  const [timeRemaining, setTimeRemaining] = useState<CountdownTime>(calculateTimeRemaining)

  useEffect(() => {
    // Initial compute
    setTimeRemaining(calculateTimeRemaining())

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [targetDateISO])

  return timeRemaining
}

