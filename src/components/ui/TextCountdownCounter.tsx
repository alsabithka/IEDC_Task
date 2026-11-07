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
      className={`flex flex-col items-center lg:items-end justify-center w-full select-none ${className}`}
      aria-label="Event Countdown"
    >
      {/* ── "EVENT STARTS IN:" LABEL ── */}
      <span className="mb-2.5 sm:mb-3 font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.24em] text-[#D0D0D0]">
        EVENT STARTS IN:
      </span>

      {/* ── PURE LIVE COUNTING DIGITS ── */}
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
