import React from 'react'
import { CornerBrackets, CrosshairMarker } from './CountdownDecorations'

export interface StopwatchCountdownProps {
  hours: string
  minutes: string
  seconds: string
  className?: string
  isComplete?: boolean
}

export const StopwatchCountdown: React.FC<StopwatchCountdownProps> = ({
  hours,
  minutes,
  seconds,
  className = '',
  isComplete = false,
}) => {
  return (
    <div
      className={`relative w-full max-w-[380px] select-none ${className}`}
      aria-label={`Time Remaining Today: ${hours} hours, ${minutes} minutes, ${seconds} seconds`}
    >
      {/* Precision Corner Brackets matching the calendar */}
      <CornerBrackets offset={12} size={12} strokeWidth={1} className="text-white/35" />

      {/* Crosshair calibration markings */}
      <CrosshairMarker size={8} className="absolute -top-2.5 -left-2.5 text-white/25" />
      <CrosshairMarker size={8} className="absolute -top-2.5 -right-2.5 text-white/25" />
      <CrosshairMarker size={8} className="absolute -bottom-2.5 -left-2.5 text-white/25" />
      <CrosshairMarker size={8} className="absolute -bottom-2.5 -right-2.5 text-white/25" />

      {/* Main Stopwatch Chassis Container */}
      <div className="relative w-full aspect-[360/130] bg-[#000000] rounded-sm overflow-visible">
        {/* SVG Drawing Layer: Stopwatch Crown, Geometric Frame, Calibration Ticks */}
        <svg
          viewBox="0 0 360 130"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Secondary Offset Frame Layer (Depth effect) */}
          <rect
            x="24"
            y="20"
            width="316"
            height="102"
            rx="3"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Extended Horizontal Guide Lines (Blueprint Alignment with Calendar) */}
          <line
            x1="6"
            y1="16"
            x2="354"
            y2="16"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <line
            x1="6"
            y1="118"
            x2="354"
            y2="118"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />

          {/* Extended Vertical Guide Lines */}
          <line
            x1="20"
            y1="6"
            x2="20"
            y2="126"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
          <line
            x1="340"
            y1="6"
            x2="340"
            y2="126"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />

          {/* Circular intersection nodes where axes cross */}
          <circle cx="20" cy="16" r="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="340" cy="16" r="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="20" cy="118" r="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="340" cy="118" r="2" fill="#FFFFFF" opacity="0.6" />

          {/* Upper Stopwatch Push-Button Crown Accent */}
          <g>
            {/* Button neck */}
            <rect
              x="176"
              y="10"
              width="8"
              height="6"
              fill="#FFFFFF"
              opacity="0.4"
            />
            {/* Crown button head */}
            <rect
              x="166"
              y="3"
              width="28"
              height="7"
              rx="2"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              fill="#000000"
            />
            {/* Subtle crown grip groove */}
            <line x1="175" y1="5" x2="175" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="180" y1="5" x2="180" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
            <line x1="185" y1="5" x2="185" y2="8" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          </g>

          {/* Main Rectangular Stopwatch Chassis Frame */}
          <rect
            x="20"
            y="16"
            width="320"
            height="102"
            rx="3"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Calibrated 24-Hour Measurement Ticks along the bottom bezel */}
          <g stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.9">
            {Array.from({ length: 25 }).map((_, i) => {
              const x = 32 + i * 12.33
              const isMajor = i % 6 === 0
              return (
                <line
                  key={i}
                  x1={x}
                  y1={118}
                  x2={x}
                  y2={isMajor ? 111 : 114}
                  stroke={isMajor ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
                />
              )
            })}
          </g>

          {/* Technical Micro-Annotations inside SVG for zero-collision precision */}
          <text
            x="32"
            y="106"
            fill="#777777"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="1.2"
            className="select-none uppercase"
          >
            CHRONO_TRACK // 24H
          </text>
          <text
            x="328"
            y="106"
            textAnchor="end"
            fill="#777777"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="1"
            className="select-none uppercase"
          >
            {isComplete ? 'ENDED' : 'RUNNING'}
          </text>
        </svg>

        {/* Content Overlay: Micro-Annotations & Precision Digital Stopwatch */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 pt-5">
          {/* Header Band: Technical Micro-Labels */}
          <div className="flex items-center justify-between px-2 text-[10px] font-mono tracking-[0.18em] text-[#D0D0D0] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span>TIME REMAINING / 02</span>
            </span>
            <span className="text-[#777777] font-semibold">24H PRECISION</span>
          </div>

          {/* Center Digital Display: Large HH : MM : SS */}
          <div className="flex-1 flex items-center justify-center -mt-2">
            <div className="flex items-baseline gap-1.5 sm:gap-2.5 font-tech font-bold text-white text-[clamp(2.4rem,8.5vw,3.6rem)] tracking-tight tabular-nums leading-none">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="transition-all duration-200">{hours}</span>
                <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#777777] mt-0.5">
                  HRS
                </span>
              </div>

              {/* Colon Separator 1 */}
              <span className="text-white/60 font-mono text-2xl sm:text-3xl self-center -mt-3.5 select-none">
                :
              </span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="transition-all duration-200">{minutes}</span>
                <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#777777] mt-0.5">
                  MIN
                </span>
              </div>

              {/* Colon Separator 2 */}
              <span className="text-white/60 font-mono text-2xl sm:text-3xl self-center -mt-3.5 select-none">
                :
              </span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="text-white transition-all duration-200">{seconds}</span>
                <span className="font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#777777] mt-0.5">
                  SEC
                </span>
              </div>
            </div>
          </div>

          {/* Spacer for SVG footer */}
          <div className="h-2" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default StopwatchCountdown
