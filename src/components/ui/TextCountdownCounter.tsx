import React from 'react'

export interface TextCountdownCounterProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  dateRange?: string
  className?: string
}

function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

export const TextCountdownCounter: React.FC<TextCountdownCounterProps> = ({
  days,
  hours,
  minutes,
  seconds,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center lg:justify-end w-full select-none ${className}`}
      aria-label="Event Countdown"
    >
      {/* ── PURE LIVE COUNTING DIGITS ONLY (No four side lines, no lines in between, no extra elements) ── */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 lg:gap-5 font-mono font-black text-[clamp(2.2rem,7.5vw,4.2rem)] lg:text-[clamp(3.8rem,5.2vw,6.5rem)] xl:text-[clamp(4.6rem,6.2vw,8rem)] text-white tabular-nums leading-none tracking-tight">
        <span>{pad2(days)}</span>
        <span className="text-white/35">:</span>
        <span>{pad2(hours)}</span>
        <span className="text-white/35">:</span>
        <span>{pad2(minutes)}</span>
        <span className="text-white/35">:</span>
        <span>{pad2(seconds)}</span>
      </div>
    </div>
  )
}

export default TextCountdownCounter
