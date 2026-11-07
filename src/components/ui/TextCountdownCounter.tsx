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
  dateRange = 'DECEMBER 12 – 13, 2026',
  className = '',
}) => {
  const units = [
    { value: pad2(days), label: 'DAYS' },
    { value: pad2(hours), label: 'HOURS' },
    { value: pad2(minutes), label: 'MINUTES' },
    { value: pad2(seconds), label: 'SECONDS' },
  ]

  return (
    <div
      className={`w-full max-w-[620px] bg-[#0C0C0C]/90 border border-white/12 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 lg:p-9 shadow-2xl backdrop-blur-md relative ${className}`}
      aria-label="Event Countdown and Date"
    >
      {/* ── 1. CORNER ACCENT BRACKETS (Technical brutalist framing) ── */}
      <span className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-white/30 pointer-events-none" aria-hidden="true" />
      <span className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-white/30 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-white/30 pointer-events-none" aria-hidden="true" />
      <span className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-white/30 pointer-events-none" aria-hidden="true" />

      {/* ── 2. EVENT DATE ── */}
      <div className="flex items-center justify-center pb-4 sm:pb-5 mb-5 sm:mb-7 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#E0E0E0]">
            {dateRange}
          </span>
        </div>
      </div>

      {/* ── 3. FOUR-COLUMN LIVE TEXT COUNTDOWN ── */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-5 items-center text-center">
        {units.map((unit, idx) => (
          <div key={unit.label} className="flex flex-col items-center relative">
            {/* Number Display */}
            <span className="font-mono font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white tabular-nums leading-none tracking-tight">
              {unit.value}
            </span>

            {/* Label Display */}
            <span className="mt-2.5 sm:mt-3 font-mono text-[9px] sm:text-xs md:text-sm font-bold tracking-[0.2em] text-[#888888] uppercase">
              {unit.label}
            </span>

            {/* Subtle column divider between units (except last) */}
            {idx < units.length - 1 && (
              <span
                className="hidden sm:block absolute -right-2 md:-right-2.5 top-1/2 -translate-y-1/2 w-[1px] h-10 bg-white/10 pointer-events-none"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TextCountdownCounter
