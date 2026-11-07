import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Menu,
  Navigation,
  Compass,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  RotateCw,
  Octagon,
} from 'lucide-react'
import type { GameStationConfig } from '../../../config/trainGameConfig'
import type { TrainDynamics } from '../controls/useGameProgress'

interface GameHUDProps {
  dynamics: TrainDynamics
  nextStation: GameStationConfig
  distanceMeters: number
  isAtStation: boolean
  isOvershot: boolean
  overshotStation: GameStationConfig | null
  overshotDistanceMeters: number
  activeStation: GameStationConfig | null
  onOpenSessionModal: () => void
  onTogglePause: () => void
  onReturnToWebsite: () => void
  onReverseToPlatform: () => void
  onMobileThrottle: (direction: 'up' | 'down', active: boolean) => void
  onSliderThrottle: (percent: number) => void
  onMobileBrake: (active: boolean) => void
  onSetCameraLook: (x: number, y: number) => void
  onMobileInteract: () => void
  fps?: number
  frameTimeMs?: number
  quality?: string
  showFpsOverlay?: boolean
}

export const GameHUD: React.FC<GameHUDProps> = ({
  dynamics,
  nextStation,
  distanceMeters,
  isAtStation,
  isOvershot,
  overshotStation,
  overshotDistanceMeters,
  activeStation,
  onOpenSessionModal,
  onTogglePause,
  onReturnToWebsite,
  onReverseToPlatform,
  onSliderThrottle,
  onMobileBrake,
  onSetCameraLook,
  onMobileInteract,
  fps = 60,
  frameTimeMs = 16.6,
  quality = 'medium',
  showFpsOverlay = false,
}) => {
  // Mobile orientation detection
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.innerHeight > window.innerWidth
  })
  const [dismissRotatePrompt, setDismissRotatePrompt] = useState<boolean>(false)

  // Track orientation changes
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // Throttle slider drag tracking
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const isDraggingSliderRef = useRef<boolean>(false)

  const handleSliderPointer = useCallback(
    (clientY: number) => {
      if (!sliderTrackRef.current) return
      const rect = sliderTrackRef.current.getBoundingClientRect()
      // Dragging upward: bottom is 0%, top is 100%
      const relativeY = clientY - rect.top
      const normalized = 1 - relativeY / rect.height
      const percent = Math.round(Math.max(0, Math.min(1, normalized)) * 100)
      onSliderThrottle(percent)
    },
    [onSliderThrottle]
  )

  const onSliderDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDraggingSliderRef.current = true
    handleSliderPointer(e.clientY)
  }

  const onSliderMove = (e: React.PointerEvent) => {
    if (isDraggingSliderRef.current) {
      handleSliderPointer(e.clientY)
    }
  }

  const onSliderUp = (e: React.PointerEvent) => {
    isDraggingSliderRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignored
    }
  }

  // Touch Camera Look Drag tracking on central windshield area
  const touchLookStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleLookPointerDown = (e: React.PointerEvent) => {
    // Only capture primary touch on background area
    if (e.target !== e.currentTarget) return
    touchLookStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleLookPointerMove = (e: React.PointerEvent) => {
    if (!touchLookStartRef.current) return
    const deltaX = (e.clientX - touchLookStartRef.current.x) / (window.innerWidth * 0.45)
    const deltaY = -(e.clientY - touchLookStartRef.current.y) / (window.innerHeight * 0.45)
    onSetCameraLook(
      Math.max(-1, Math.min(1, deltaX)),
      Math.max(-1, Math.min(1, deltaY))
    )
  }

  const handleLookPointerUp = () => {
    touchLookStartRef.current = null
    // Smooth decay back to forward look
    onSetCameraLook(0, 0)
  }

  // Distance stage alerts
  const isFarAhead = distanceMeters > 45 && distanceMeters <= 80 && !isAtStation && !isOvershot
  const isPrepareBrakes = distanceMeters > 20 && distanceMeters <= 45 && !isAtStation && !isOvershot
  const isStopTargetZone = distanceMeters <= 20 && distanceMeters > 0 && !isAtStation && !isOvershot
  const isReversing = dynamics.speedKmh < -0.2

  const throttlePercent = Math.round(dynamics.throttlePercent)
  const brakeActive = dynamics.brakePercent > 10

  return (
    <div className="absolute inset-0 select-none z-20 pointer-events-none flex flex-col justify-between p-3 sm:p-5 overflow-hidden">
      {/* ==================================================================
          BACKGROUND TOUCH LOOK LAYER (Windshield Camera Drag Area)
          ================================================================== */}
      <div
        className="absolute inset-0 pointer-events-auto z-0 touch-none"
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
      />

      {/* ==================================================================
          PORTRAIT ORIENTATION BANNER (Dismissable prompt to rotate)
          ================================================================== */}
      {isPortrait && !dismissRotatePrompt && (
        <div className="relative z-30 pointer-events-auto mb-2 flex items-center justify-between gap-3 rounded-2xl border-2 border-amber-400 bg-slate-950/95 backdrop-blur-md px-4 py-2.5 text-xs text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-amber-400 shrink-0 animate-spin" />
            <span className="font-mono text-[11px] leading-tight">
              Rotate to <strong className="text-amber-300">Landscape</strong> for optimal cabin view
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDismissRotatePrompt(true)}
            className="rounded-full bg-slate-800 px-2.5 py-1 text-[10px] font-mono uppercase text-slate-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ==================================================================
          1. TOP NAVIGATION, STATION TELEMETRY & PAUSE
          ================================================================== */}
      <div className="relative z-10 flex items-center justify-between gap-2 pointer-events-auto">
        {/* Back to Website Button */}
        <button
          type="button"
          onClick={onReturnToWebsite}
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-sky-400/30 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 active:scale-95 transition-all cursor-pointer shadow-lg min-h-[44px]"
          aria-label="Back to Website"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
          <span className="hidden xs:inline">Website</span>
        </button>

        {/* Center Station Proximity Pill */}
        <div
          className="flex items-center gap-2 sm:gap-3 rounded-full border bg-slate-950/85 backdrop-blur-md px-3.5 sm:px-5 py-2 font-mono text-xs text-white shadow-lg transition-colors"
          style={{
            borderColor: isAtStation && activeStation ? activeStation.accentColor : '#38BDF8',
          }}
        >
          <Navigation
            className="h-3.5 w-3.5 shrink-0 animate-pulse"
            style={{
              color: isAtStation && activeStation ? activeStation.accentColor : '#38BDF8',
            }}
          />
          <span className="font-bold text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-[240px]">
            {isAtStation
              ? `${activeStation?.name.toUpperCase()}`
              : `NEXT: ${nextStation.name.toUpperCase()}`}
          </span>
          <span className="text-slate-500">·</span>
          <span
            className="font-bold text-[11px] sm:text-xs"
            style={{
              color: isAtStation && activeStation ? activeStation.accentColor : '#FACC15',
            }}
          >
            {`${distanceMeters}m`}
          </span>
        </div>

        {/* Top Right: Optional FPS Counter & Pause Button */}
        <div className="flex items-center gap-2">
          {showFpsOverlay && (
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 font-mono text-[10px] text-slate-300">
              <span className={`font-bold ${fps < 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {fps} FPS
              </span>
              <span>·</span>
              <span>{frameTimeMs}ms</span>
              <span>·</span>
              <span className="uppercase text-amber-300">{quality}</span>
            </div>
          )}

          <button
            type="button"
            onClick={onTogglePause}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/30 bg-slate-950/85 backdrop-blur-md p-2.5 sm:px-4 sm:py-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 active:scale-95 transition-all cursor-pointer shadow-lg min-h-[44px] min-w-[44px]"
            aria-label="Pause Game"
          >
            <Menu className="h-4 w-4 text-sky-400" />
            <span className="hidden sm:inline ml-1.5">Pause</span>
          </button>
        </div>
      </div>

      {/* ==================================================================
          2. CENTER NOTIFICATIONS: APPROACH WARNINGS & OVERSHOOT
          ================================================================== */}
      <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center gap-2 sm:gap-3 pointer-events-none max-w-[92vw]">
        {/* Stage 1: Station Ahead */}
        {isFarAhead && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200 rounded-full border border-sky-400/50 bg-slate-950/90 backdrop-blur-md px-5 py-2 text-xs font-mono uppercase tracking-wider text-sky-200 shadow-xl flex items-center gap-2">
            <Compass className="h-4 w-4 text-sky-400 animate-spin" />
            <span>AHEAD: {nextStation.name}</span>
            <span className="text-amber-300 font-bold">{distanceMeters}m</span>
          </div>
        )}

        {/* Stage 2: Prepare Brakes */}
        {isPrepareBrakes && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200 rounded-full border-2 border-amber-400 bg-slate-950/90 backdrop-blur-md px-5 py-2 text-xs font-mono uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(245,158,11,0.3)] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 animate-bounce" />
            <span>PREPARE BRAKES</span>
            <span className="text-amber-300 font-bold">{distanceMeters}m</span>
            <span className="hidden sm:inline text-slate-300">({nextStation.name})</span>
          </div>
        )}

        {/* Stage 3: Target Stop Zone */}
        {isStopTargetZone && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200 rounded-full border-2 border-rose-500 bg-slate-950/95 backdrop-blur-md px-5 py-2 text-xs font-mono uppercase tracking-wider text-white shadow-[0_8px_35px_rgba(239,68,68,0.4)] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-rose-300">STOP AT PLATFORM</span>
            <span className="text-yellow-300 font-black">{distanceMeters}m</span>
          </div>
        )}

        {/* Overshoot Recovery */}
        {isOvershot && overshotStation && (
          <div className="animate-in fade-in zoom-in-95 duration-200 pointer-events-auto rounded-3xl border-2 border-amber-400 bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 text-center shadow-[0_15px_45px_rgba(245,158,11,0.3)] max-w-sm sm:max-w-md mx-2">
            <div className="flex items-center justify-center gap-2 mb-1.5 text-xs font-mono uppercase text-amber-400 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-400 animate-bounce" />
              <span>MISSED STOPPING POINT</span>
            </div>
            <h4 className="font-sans text-sm sm:text-base font-black text-white uppercase tracking-tight">
              Overshot by {overshotDistanceMeters}m past {overshotStation.name}
            </h4>
            <button
              type="button"
              onClick={onReverseToPlatform}
              className="mt-3.5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-sans text-xs font-black uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-xl cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4 text-slate-950" />
              <span>[↩ REVERSE TO PLATFORM]</span>
            </button>
          </div>
        )}

        {/* Platform Stopped Notification with Large Touch Interact Button */}
        {isAtStation && activeStation && (
          <div
            className="animate-in fade-in zoom-in-95 duration-200 pointer-events-auto rounded-3xl border-2 bg-slate-950/95 backdrop-blur-xl p-4 sm:p-5 text-center shadow-[0_15px_45px_rgba(0,0,0,0.5)] max-w-sm sm:max-w-md mx-2"
            style={{ borderColor: activeStation.accentColor }}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1 text-[11px] font-mono uppercase text-slate-300">
              <Sparkles className="h-3.5 w-3.5" style={{ color: activeStation.accentColor }} />
              <span>Platform Safe Stop</span>
            </div>
            <h4 className="font-sans text-base sm:text-lg font-black text-white uppercase tracking-tight">
              {activeStation.name}
            </h4>
            <p className="font-mono text-[11px] text-slate-300 mt-0.5">
              <span className="text-amber-400 font-bold">{activeStation.time}</span> · {activeStation.sessionTitle}
            </p>

            {/* Prominent Touch Button: Explore Session */}
            <button
              type="button"
              onClick={() => {
                onMobileInteract()
                onOpenSessionModal()
              }}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 active:scale-95 transition-all shadow-xl cursor-pointer w-full min-h-[48px]"
              style={{ backgroundColor: activeStation.accentColor }}
            >
              <span>Explore Session Details</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================
          3. DUAL-SIDE ERGONOMIC MOBILE CONTROLS & DASHBOARD TELEMETRY
          ================================================================== */}
      <div className="relative z-20 flex items-end justify-between gap-3 pointer-events-none w-full">
        {/* ==========================================
            LEFT SIDE: BRAKE CONTROLS & SPEEDOMETER
            ========================================== */}
        <div className="flex flex-col gap-2.5 pointer-events-auto">
          {/* Speedometer Telemetry Readout */}
          <div className="flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-sky-400/30 bg-slate-950/85 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-2xl">
            <div>
              <div className="font-mono text-[9px] sm:text-[10px] text-sky-400 uppercase tracking-wider font-bold">
                {isReversing ? 'REVERSE' : 'Speed'}
              </div>
              <div
                className={`font-mono font-black text-xl sm:text-2xl leading-none ${
                  isReversing ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {isReversing ? `R ${Math.abs(Math.round(dynamics.speedKmh))}` : Math.round(dynamics.speedKmh)}
                <span className="text-[10px] font-normal text-slate-400 ml-1">KM/H</span>
              </div>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div>
              <div className="font-mono text-[9px] sm:text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                Throttle
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-amber-300">
                {throttlePercent}%
              </div>
            </div>
          </div>

          {/* Large Ergonomic Brake Buttons */}
          <div className="flex items-center gap-2">
            {/* Press & Hold Service Brake Button */}
            <button
              type="button"
              onPointerDown={() => onMobileBrake(true)}
              onPointerUp={() => onMobileBrake(false)}
              onPointerLeave={() => onMobileBrake(false)}
              onPointerCancel={() => onMobileBrake(false)}
              className={`flex h-14 sm:h-16 w-24 sm:w-28 flex-col items-center justify-center rounded-2xl border-2 font-mono font-black text-xs uppercase cursor-pointer shadow-xl transition-all select-none touch-none active:scale-95 ${
                brakeActive
                  ? 'bg-rose-500 border-rose-300 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                  : 'bg-rose-950/85 border-rose-500/70 text-rose-200 hover:bg-rose-900/80'
              }`}
              aria-label="Hold to Brake"
            >
              <Octagon className="h-4 w-4 mb-0.5 fill-rose-500" />
              <span>{brakeActive ? 'BRAKING' : 'BRAKE'}</span>
            </button>

            {/* Quick Emergency Brake Notch */}
            <button
              type="button"
              onClick={() => {
                onSliderThrottle(0)
                onMobileBrake(true)
                setTimeout(() => onMobileBrake(false), 800)
              }}
              className="flex h-14 sm:h-16 px-3 flex-col items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-[10px] font-mono font-bold text-slate-300 hover:text-white active:bg-slate-800 cursor-pointer shadow-lg min-w-[48px]"
              title="Full stop / emergency brake"
            >
              <span className="text-amber-400 font-black">E-STOP</span>
              <span className="text-[9px] text-slate-400">0%</span>
            </button>
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDE: DEDICATED VERTICAL THROTTLE SLIDER
            ========================================== */}
        <div className="flex items-end gap-2.5 pointer-events-auto">
          {/* Mobile Step Buttons (Optional quick taps) */}
          <div className="hidden xs:flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => onSliderThrottle(Math.min(100, throttlePercent + 20))}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/50 bg-emerald-950/80 text-emerald-300 active:bg-emerald-800 cursor-pointer shadow-md text-xs font-mono font-bold"
              aria-label="Increment throttle by 20 percent"
            >
              +20%
            </button>
            <button
              type="button"
              onClick={() => onSliderThrottle(Math.max(0, throttlePercent - 20))}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-300 active:bg-slate-800 cursor-pointer shadow-md text-xs font-mono font-bold"
              aria-label="Decrement throttle by 20 percent"
            >
              -20%
            </button>
          </div>

          {/* Large Vertical Touch Slider Container */}
          <div className="flex flex-col items-center">
            {/* Slider Percent Header Readout */}
            <div className="mb-1 rounded-full bg-slate-950/90 border border-amber-400/50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 shadow">
              {throttlePercent}%
            </div>

            {/* Vertical Slider Track */}
            <div
              ref={sliderTrackRef}
              onPointerDown={onSliderDown}
              onPointerMove={onSliderMove}
              onPointerUp={onSliderUp}
              onPointerCancel={onSliderUp}
              className="relative h-32 xs:h-36 sm:h-48 w-12 sm:w-15 rounded-2xl border-2 border-amber-400/60 bg-slate-950/90 backdrop-blur-md shadow-2xl cursor-pointer touch-none select-none flex flex-col justify-end p-1.5 overflow-hidden active:border-amber-300"
              aria-label="Vertical Throttle Slider"
              role="slider"
              aria-valuenow={throttlePercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* Dynamic Fill Height Bar */}
              <div
                className="w-full rounded-xl transition-all duration-75 bg-gradient-to-t from-emerald-500 via-amber-400 to-rose-500 opacity-90 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                style={{ height: `${throttlePercent}%` }}
              />

              {/* Thumb Handle Knob */}
              <div
                className="absolute left-1 right-1 h-6 -translate-y-1/2 rounded-xl border-2 border-white bg-slate-900 shadow-xl flex items-center justify-center pointer-events-none transition-all duration-75"
                style={{ bottom: `${throttlePercent}%` }}
              >
                <div className="w-5 h-1 rounded-full bg-amber-400" />
              </div>

              {/* Background Reference Track Markings */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-3 px-2 text-[8px] font-mono text-slate-500 font-bold opacity-60">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
            </div>

            {/* Bottom Notch: Zero / Idle Trigger */}
            <button
              type="button"
              onClick={() => onSliderThrottle(0)}
              className="mt-1 w-full py-1 rounded-lg border border-slate-700 bg-slate-900/80 text-[10px] font-mono font-bold text-slate-300 hover:text-white active:bg-slate-800 text-center cursor-pointer min-h-[32px]"
            >
              IDLE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameHUD
