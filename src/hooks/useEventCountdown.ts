import { useState, useEffect } from 'react'
import { EVENT_CONFIG } from '../data/eventConfig'

export interface EventCountdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  daysStr: string
  hoursStr: string
  minutesStr: string
  secondsStr: string
  timeFormatted: string
  isComplete: boolean
  totalSeconds: number
}

function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

function computeCountdown(targetISO: string): EventCountdown {
  const target = new Date(targetISO).getTime()
  const now = Date.now()
  const diff = target - now

  if (isNaN(target) || diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      daysStr: '00',
      hoursStr: '00',
      minutesStr: '00',
      secondsStr: '00',
      timeFormatted: '00 : 00 : 00',
      isComplete: true,
      totalSeconds: 0,
    }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  const daysStr = pad2(days)
  const hoursStr = pad2(hours)
  const minutesStr = pad2(minutes)
  const secondsStr = pad2(seconds)

  return {
    days,
    hours,
    minutes,
    seconds,
    daysStr,
    hoursStr,
    minutesStr,
    secondsStr,
    timeFormatted: `${hoursStr} : ${minutesStr} : ${secondsStr}`,
    isComplete: false,
    totalSeconds,
  }
}

/**
 * Event Countdown hook that computes live remaining time from
 * authoritative event configuration in src/data/eventConfig.ts.
 */
export function useEventCountdown(
  targetISO: string = EVENT_CONFIG.dates.targetCountdownISO
): EventCountdown {
  const [countdown, setCountdown] = useState<EventCountdown>(() => computeCountdown(targetISO))

  useEffect(() => {
    const tick = () => setCountdown(computeCountdown(targetISO))
    const intervalId = setInterval(tick, 1000)

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        tick()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [targetISO])

  return countdown
}

export default useEventCountdown

