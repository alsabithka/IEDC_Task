import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CornerBrackets, CrosshairMarker, CalibrationTicks } from './CountdownDecorations'

export interface DaysRemainingCalendarProps {
  days: string
  className?: string
  isComplete?: boolean
}

export const DaysRemainingCalendar: React.FC<DaysRemainingCalendarProps> = ({
  days,
  className = '',
  isComplete = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<SVGRectElement>(null)
  const dividerRef = useRef<SVGLineElement>(null)
  const ringsGroupRef = useRef<SVGGElement>(null)
  const gridGroupRef = useRef<SVGGElement>(null)
  const ticksGroupRef = useRef<SVGGElement>(null)
  const numberRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      // Respect prefers-reduced-motion
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        return
      }

      const frame = frameRef.current
      const divider = dividerRef.current
      const rings = ringsGroupRef.current
      const grid = gridGroupRef.current
      const ticks = ticksGroupRef.current
      const numberEl = numberRef.current
      const labelEl = labelRef.current

      if (!frame || !divider || !rings || !grid || !ticks || !numberEl) return

      // Measure SVG path length for clean stroke draw
      const frameLength = frame.getTotalLength ? frame.getTotalLength() : 1100
      const dividerLength = divider.getTotalLength ? divider.getTotalLength() : 320

      // Initial state
      gsap.set(frame, {
        strokeDasharray: frameLength,
        strokeDashoffset: frameLength,
      })
      gsap.set(divider, {
        strokeDasharray: dividerLength,
        strokeDashoffset: dividerLength,
      })
      gsap.set(rings.children, {
        scaleY: 0,
        opacity: 0,
        transformOrigin: 'top center',
      })
      gsap.set(grid.children, {
        opacity: 0,
        scale: 0.95,
      })
      gsap.set(ticks.children, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: 'left center',
      })
      gsap.set([numberEl, labelEl], {
        opacity: 0,
        y: 18,
      })

      // Master technical entrance timeline
      const tl = gsap.timeline({
        delay: 0.35,
        defaults: { ease: 'power2.out' },
      })

      // 1. Outer calendar frame draws itself
      tl.to(frame, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      })
        // 2. Header divider draws from left to right
        .to(
          divider,
          {
            strokeDashoffset: 0,
            duration: 0.65,
            ease: 'power2.out',
          },
          '-=0.45',
        )
        // 3. Binding rings appear with subtle scale animation
        .to(
          rings.children,
          {
            scaleY: 1,
            opacity: 1,
            stagger: 0.08,
            duration: 0.45,
            ease: 'back.out(1.5)',
          },
          '-=0.3',
        )
        // 4. Calendar grid lines reveal sequentially
        .to(
          grid.children,
          {
            opacity: 1,
            scale: 1,
            stagger: 0.04,
            duration: 0.4,
          },
          '-=0.25',
        )
        // 5. Measurement ticks appear in staggered sequence
        .to(
          ticks.children,
          {
            opacity: 1,
            scaleX: 1,
            stagger: 0.02,
            duration: 0.35,
          },
          '-=0.2',
        )
        // 6. Day number & DAYS LEFT label enter using subtle vertical reveal
        .to(
          [numberEl, labelEl],
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.15',
        )
    },
    { scope: containerRef },
  )

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[380px] select-none ${className}`}
      aria-label={`${days} Days Left until Idea Sprint 2026`}
    >
      {/* Precision Corner Brackets around the calendar instrument frame */}
      <CornerBrackets offset={14} size={14} strokeWidth={1} className="text-white/35" />

      {/* Crosshair calibration markings near selected corners */}
      <CrosshairMarker size={10} className="absolute -top-3 -left-3 text-white/30" />
      <CrosshairMarker size={10} className="absolute -top-3 -right-3 text-white/30" />
      <CrosshairMarker size={10} className="absolute -bottom-3 -left-3 text-white/30" />
      <CrosshairMarker size={10} className="absolute -bottom-3 -right-3 text-white/30" />

      {/* Calibration measurement tick ruler along left edge */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden sm:block">
        <CalibrationTicks ticks={12} height={150} className="text-white/20" />
      </div>

      {/* Calibration measurement tick ruler along right edge */}
      <div className="absolute -right-6 top-1/2 -translate-y-1/2 hidden sm:block rotate-180">
        <CalibrationTicks ticks={12} height={150} className="text-white/20" />
      </div>

      {/* Main Technical Calendar Drawing & Container */}
      <div className="relative w-full aspect-[360/300] bg-[#000000] rounded-sm overflow-visible">
        {/* SVG Drawing Layer for Frame, Rings, Dividers & Measurement Lines */}
        <svg
          viewBox="0 0 360 300"
          className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Secondary Offset Frame Layer (Depth effect) */}
          <rect
            x="24"
            y="26"
            width="316"
            height="254"
            rx="3"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Extended Horizontal Guide Lines (Blueprint Axis) */}
          <line
            x1="4"
            y1="22"
            x2="356"
            y2="22"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />
          <line
            x1="8"
            y1="72"
            x2="352"
            y2="72"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="0.8"
          />
          <line
            x1="4"
            y1="272"
            x2="356"
            y2="272"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.8"
            strokeDasharray="4 4"
          />

          {/* Extended Vertical Guide Lines */}
          <line
            x1="20"
            y1="8"
            x2="20"
            y2="288"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />
          <line
            x1="340"
            y1="8"
            x2="340"
            y2="288"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="3 4"
          />

          {/* Circular intersection nodes where axes cross */}
          <circle cx="20" cy="22" r="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="340" cy="22" r="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="20" cy="72" r="2.2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="340" cy="72" r="2.2" fill="#FFFFFF" opacity="0.8" />
          <circle cx="20" cy="272" r="2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="340" cy="272" r="2" fill="#FFFFFF" opacity="0.6" />

          {/* Main Rectangular Calendar Outer Frame */}
          <rect
            ref={frameRef}
            x="20"
            y="22"
            width="320"
            height="250"
            rx="3"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Horizontal Divider Separating Header from Main Calendar Area */}
          <line
            ref={dividerRef}
            x1="20"
            y1="72"
            x2="340"
            y2="72"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* 3 Precision Calendar Binding Rings at Top */}
          <g ref={ringsGroupRef}>
            {/* Ring 1 (Left) */}
            <g>
              <rect
                x="88"
                y="10"
                width="12"
                height="24"
                rx="6"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                fill="#000000"
              />
              <line x1="94" y1="13" x2="94" y2="31" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="94" cy="30" r="2.2" fill="#FFFFFF" opacity="0.3" />
            </g>

            {/* Ring 2 (Center) */}
            <g>
              <rect
                x="174"
                y="10"
                width="12"
                height="24"
                rx="6"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                fill="#000000"
              />
              <line x1="180" y1="13" x2="180" y2="31" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="180" cy="30" r="2.2" fill="#FFFFFF" opacity="0.3" />
            </g>

            {/* Ring 3 (Right) */}
            <g>
              <rect
                x="260"
                y="10"
                width="12"
                height="24"
                rx="6"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                fill="#000000"
              />
              <line x1="266" y1="13" x2="266" y2="31" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
              <circle cx="266" cy="30" r="2.2" fill="#FFFFFF" opacity="0.3" />
            </g>
          </g>

          {/* Subtle Background Date-Grid Lines */}
          <g ref={gridGroupRef} stroke="rgba(255, 255, 255, 0.07)" strokeWidth="0.8">
            {/* Vertical grid lines */}
            <line x1="100" y1="72" x2="100" y2="272" strokeDasharray="2 3" />
            <line x1="180" y1="72" x2="180" y2="272" strokeDasharray="2 3" />
            <line x1="260" y1="72" x2="260" y2="272" strokeDasharray="2 3" />

            {/* Horizontal grid lines */}
            <line x1="20" y1="138" x2="340" y2="138" strokeDasharray="2 3" />
            <line x1="20" y1="205" x2="340" y2="205" strokeDasharray="2 3" />

            {/* Tiny Date-Grid Dot Matrix (top-right corner of calendar area) */}
            <circle cx="308" cy="92" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="316" cy="92" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="324" cy="92" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="308" cy="100" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="316" cy="100" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="324" cy="100" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="308" cy="108" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="316" cy="108" r="1" fill="#FFFFFF" opacity="0.4" />
            <circle cx="324" cy="108" r="1" fill="#FFFFFF" opacity="0.4" />
          </g>

          {/* Calibration Measurement Ticks along bottom edge */}
          <g ref={ticksGroupRef} stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1">
            {Array.from({ length: 15 }).map((_, i) => {
              const x = 36 + i * 20.5
              const isMajor = i % 5 === 0
              return (
                <line
                  key={i}
                  x1={x}
                  y1={272}
                  x2={x}
                  y2={isMajor ? 263 : 267}
                />
              )
            })}
          </g>

          {/* Technical Micro-Annotations inside SVG for zero-collision precision */}
          <text
            x="32"
            y="255"
            fill="#777777"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="1.5"
            className="select-none uppercase"
          >
            SYS_REF // SPRINT_CAL
          </text>
          <text
            x="328"
            y="255"
            textAnchor="end"
            fill="#777777"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="1"
            className="select-none uppercase"
          >
            T-DAYS
          </text>
        </svg>

        {/* Content Overlay: Header Micro-Annotations & Large Dynamic Day Count */}
        <div className="absolute inset-0 flex flex-col justify-between p-5 pt-3">
          {/* Header Band: Technical Identification Labels */}
          <div className="flex items-center justify-between px-2 pt-4 text-[10px] font-mono tracking-[0.18em] text-[#D0D0D0] uppercase">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-white rounded-full" />
              <span>CALENDAR / 01</span>
            </span>
            <span className="text-[#777777] font-semibold">EDITION 2026</span>
          </div>

          {/* Main Central Display: Massive Bold Day Number & DAYS LEFT */}
          <div className="flex-1 flex flex-col items-center justify-center -mt-1 select-none">
            {/* The Days Number */}
            <div
              ref={numberRef}
              className="font-display font-black text-white text-[clamp(4.8rem,19vw,7.4rem)] tracking-tight leading-none text-center tabular-nums drop-shadow-sm will-change-transform"
            >
              {days}
            </div>

            {/* Smaller Uppercase DAYS LEFT Label */}
            <span
              ref={labelRef}
              className="mt-1 sm:mt-1.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-[#D0D0D0] text-center will-change-transform"
            >
              {isComplete ? 'EVENT STARTED' : 'DAYS LEFT'}
            </span>
          </div>

          {/* Subtle spacer replacing the HTML footer */}
          <div className="h-4" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default DaysRemainingCalendar
