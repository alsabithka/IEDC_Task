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
    onSetCameraLook(0, 0)
  }

  // Distance stage alerts
  const isPrepareBrakes = distanceMeters > 20 && distanceMeters <= 45 && !isAtStation && !isOvershot
  const isStopTargetZone = distanceMeters <= 20 && distanceMeters > 0 && !isAtStation && !isOvershot
  const isReversing = dynamics.speedKmh < -0.2

  const throttlePercent = Math.round(dynamics.throttlePercent)
  const brakeActive = dynamics.brakePercent > 10

  return (
    <div className="absolute inset-0 select-none z-20 pointer-events-none flex flex-col justify-between overflow-hidden p-2 sm:p-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]">
      {/* ==================================================================
          AREA A: BACKGROUND TOUCH-LOOK LAYER (Windshield Camera Drag)
          ================================================================== */}
      <div
        className="absolute inset-0 pointer-events-auto z-0 touch-none"
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
      />

      {/* ==================================================================
          PORTRAIT ROTATION PROMPT BANNER
          ================================================================== */}
      {isPortrait && !dismissRotatePrompt && (
        <div className="relative z-30 pointer-events-auto mb-2 flex items-center justify-between gap-3 rounded-2xl border-2 border-amber-400 bg-slate-950/95 backdrop-blur-md px-4 py-2 text-xs text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4 text-amber-400 shrink-0 animate-spin" />
            <span className="font-mono text-[11px] leading-tight">
              Rotate to <strong className="text-amber-300">Landscape</strong> for panoramic cabin view
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
          TOP NAVIGATION BAR (Unobtrusive & Pinned to Upper Corners)
          ================================================================== */}
      <div className="relative z-20 flex items-center justify-between gap-2 pointer-events-auto w-full">
        {/* Back to Website Button */}
        <button
          type="button"
          onClick={onReturnToWebsite}
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-sky-400/30 bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 active:scale-95 transition-all cursor-pointer shadow-lg min-h-[40px]"
          aria-label="Back to Website"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
          <span className="hidden xs:inline">Website</span>
        </button>

        {/* Center Station Ahead Alert / Pill */}
        <div
          className="flex items-center gap-2 rounded-full border bg-slate-950/85 backdrop-blur-md px-3 sm:px-4 py-1.5 font-mono text-xs text-white shadow-lg transition-colors"
          style={{
            borderColor: isAtStation && activeStation ? activeStation.accentColor : '#38BDF8',
          }}
        >
          <Navigation
            className="h-3 w-3 shrink-0 animate-pulse"
            style={{
              color: isAtStation && activeStation ? activeStation.accentColor : '#38BDF8',
            }}
          />
          <span className="font-bold text-[10px] sm:text-xs truncate max-w-[130px] sm:max-w-[220px]">
            {isAtStation
              ? `${activeStation?.name.toUpperCase()}`
              : `NEXT: ${nextStation.name.toUpperCase()}`}
          </span>
          <span className="text-slate-500">·</span>
          <span
            className="font-bold text-[10px] sm:text-xs"
            style={{
              color: isAtStation && activeStation ? activeStation.accentColor : '#FACC15',
            }}
          >
            {`${distanceMeters}m`}
          </span>
        </div>

        {/* Top Right: Camera Recentre & Pause Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {showFpsOverlay && (
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/80 px-2.5 py-1 font-mono text-[10px] text-slate-300">
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
            onClick={() => onSetCameraLook(0, 0)}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/30 bg-slate-950/85 backdrop-blur-md p-2 sm:px-3 sm:py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 active:scale-95 transition-all cursor-pointer shadow-lg min-h-[38px] min-w-[38px]"
            title="Recentre Camera Forward"
            aria-label="Recentre Camera"
          >
            <Compass className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden md:inline ml-1 text-xs">Center</span>
          </button>

          <button
            type="button"
            onClick={onTogglePause}
            className="inline-flex items-center justify-center rounded-full border border-sky-400/30 bg-slate-950/85 backdrop-blur-md p-2 sm:px-3 sm:py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 active:scale-95 transition-all cursor-pointer shadow-lg min-h-[38px] min-w-[38px]"
            aria-label="Pause Game"
          >
            <Menu className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline ml-1 text-xs">Pause</span>
          </button>
        </div>
      </div>

      {/* ==================================================================
          AREA A: FLOATING APPROACH ALERTS & OVERSHOOT (High Center, Leaves Tracks Open)
          ================================================================== */}
      <div className="absolute top-12 sm:top-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center gap-2 pointer-events-none max-w-[90vw]">
        {/* Stage 2: Prepare Brakes (Alert pops up when stopping window nears) */}
        {isPrepareBrakes && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 rounded-full border-2 border-amber-400 bg-slate-950/90 backdrop-blur-md px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(245,158,11,0.3)] flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
            <span>PREPARE BRAKES</span>
            <span className="text-amber-300 font-bold">{distanceMeters}m</span>
          </div>
        )}

        {/* Stage 3: Target Stop Zone */}
        {isStopTargetZone && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200 rounded-full border-2 border-rose-500 bg-slate-950/95 backdrop-blur-md px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider text-white shadow-[0_8px_35px_rgba(239,68,68,0.4)] flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-rose-300">STOP AT PLATFORM</span>
            <span className="text-yellow-300 font-black">{distanceMeters}m</span>
          </div>
        )}

        {/* Overshoot Recovery Banner */}
        {isOvershot && overshotStation && (
          <div className="animate-in fade-in zoom-in-95 duration-200 pointer-events-auto rounded-2xl border-2 border-amber-400 bg-slate-950/95 backdrop-blur-xl p-3 sm:p-4 text-center shadow-[0_15px_45px_rgba(245,158,11,0.3)] max-w-xs sm:max-w-sm">
            <div className="flex items-center justify-center gap-1.5 mb-1 text-[10px] font-mono uppercase text-amber-400 font-bold">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
              <span>MISSED STOPPING POINT</span>
            </div>
            <p className="font-sans text-xs font-black text-white uppercase">
              Overshot by {overshotDistanceMeters}m past {overshotStation.name}
            </p>
            <button
              type="button"
              onClick={onReverseToPlatform}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 font-sans text-[11px] font-black uppercase tracking-wider active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-slate-950" />
              <span>[↩ REVERSE TO PLATFORM]</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================
          AREAS B & C: BOTTOM DASHBOARD & DUAL-SIDE THUMB CONTROLS
          ================================================================== */}
      <div className="relative z-20 flex items-end justify-between gap-1.5 sm:gap-2 pointer-events-none w-full">
        {/* ==========================================
            LEFT THUMB: BRAKE PEDAL & E-STOP
            ========================================== */}
        <div className="flex flex-col gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
          {/* Main Hold-to-Brake Button */}
          <button
            type="button"
            onPointerDown={() => onMobileBrake(true)}
            onPointerUp={() => onMobileBrake(false)}
            onPointerLeave={() => onMobileBrake(false)}
            onPointerCancel={() => onMobileBrake(false)}
            className={`flex h-11 xs:h-12 sm:h-14 w-20 xs:w-24 sm:w-28 flex-col items-center justify-center rounded-2xl border-2 font-mono font-black text-xs uppercase cursor-pointer shadow-xl transition-all select-none touch-none active:scale-95 ${
              brakeActive
                ? 'bg-rose-500 border-rose-300 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                : 'bg-rose-950/85 border-rose-500/70 text-rose-200 hover:bg-rose-900/80'
            }`}
            aria-label="Hold to Brake"
          >
            <Octagon className="h-3.5 w-3.5 mb-0.5 fill-rose-500" />
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
            className="flex h-7 sm:h-9 w-20 xs:w-24 sm:w-28 items-center justify-center gap-1 rounded-xl border border-slate-700 bg-slate-900/80 text-[10px] font-mono font-bold text-slate-300 hover:text-white active:bg-slate-800 cursor-pointer shadow-md"
            title="Emergency Stop"
          >
            <span className="text-amber-400 font-black">E-STOP</span>
            <span className="text-[9px] text-slate-400">0%</span>
          </button>
        </div>

        {/* ==========================================
            AREA B: COMPACT CENTER DASHBOARD TELEMETRY
            ========================================== */}
        <div className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-sky-400/30 bg-slate-950/90 backdrop-blur-md px-2.5 sm:px-4 py-1 sm:py-1.5 shadow-2xl pointer-events-auto mb-0.5">
          {/* Digital Speedometer */}
          <div className="text-center sm:text-left">
            <div className="font-mono text-[8px] sm:text-[9px] text-sky-400 uppercase tracking-wider font-bold">
              {isReversing ? 'REV' : 'Speed'}
            </div>
            <div
              className={`font-mono font-black text-sm sm:text-lg leading-none ${
                isReversing ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {isReversing ? `R ${Math.abs(Math.round(dynamics.speedKmh))}` : Math.round(dynamics.speedKmh)}
              <span className="text-[8px] sm:text-[9px] font-normal text-slate-400 ml-0.5">KM/H</span>
            </div>
          </div>

          <div className="h-5 sm:h-6 w-[1px] bg-slate-800" />

          {/* Throttle Percent */}
          <div className="text-center sm:text-left">
            <div className="font-mono text-[8px] sm:text-[9px] text-amber-400 uppercase tracking-wider font-bold">
              Throttle
            </div>
            <div className="font-mono font-bold text-xs sm:text-sm text-amber-300">
              {throttlePercent}%
            </div>
          </div>

          <div className="h-5 sm:h-6 w-[1px] bg-slate-800" />

          {/* Brake Indicator */}
          <div className="text-center sm:text-left">
            <div className="font-mono text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-wider font-bold">
              Brake
            </div>
            <div
              className={`font-mono font-bold text-xs sm:text-sm ${
                brakeActive ? 'text-rose-400 animate-pulse' : 'text-slate-500'
              }`}
            >
              {brakeActive ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT THUMB: THROTTLE SLIDER & INTERACT
            ========================================== */}
        <div className="flex flex-col items-end gap-1.5 pointer-events-auto">
          {/* Station Interact Button (Positioned directly above right thumb for instant tap!) */}
          {isAtStation && activeStation && (
            <button
              type="button"
              onClick={() => {
                onMobileInteract()
                onOpenSessionModal()
              }}
              className="animate-in fade-in zoom-in-95 flex items-center justify-center gap-1.5 rounded-2xl px-3.5 py-2 font-mono font-black text-[11px] uppercase cursor-pointer shadow-xl text-slate-950 active:scale-95 transition-all w-full max-w-[150px] min-h-[42px]"
              style={{ backgroundColor: activeStation.accentColor }}
              aria-label="Explore Station Session"
            >
              <Sparkles className="h-3.5 w-3.5 fill-slate-950" />
              <span>EXPLORE</span>
            </button>
          )}

          <div className="flex items-end gap-1.5">
            {/* Quick Step Buttons */}
            <div className="hidden sm:flex flex-col gap-1">
              <button
                type="button"
                onClick={() => onSliderThrottle(Math.min(100, throttlePercent + 20))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/50 bg-emerald-950/80 text-emerald-300 active:bg-emerald-800 cursor-pointer shadow text-[10px] font-mono font-bold"
                aria-label="+20% Throttle"
              >
                +20
              </button>
              <button
                type="button"
                onClick={() => onSliderThrottle(Math.max(0, throttlePercent - 20))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 active:bg-slate-800 cursor-pointer shadow text-[10px] font-mono font-bold"
                aria-label="-20% Throttle"
              >
                -20
              </button>
            </div>

            {/* Vertical Throttle Slider Column */}
            <div className="flex flex-col items-center">
              {/* Numeric Percentage Pill */}
              <div className="mb-0.5 rounded-full bg-slate-950/90 border border-amber-400/50 px-1.5 py-0.2 text-[9px] font-mono font-bold text-amber-300 shadow">
                {throttlePercent}%
              </div>

              {/* Vertical Slider Track (Adaptive clamp height for mobile landscape) */}
              <div
                ref={sliderTrackRef}
                onPointerDown={onSliderDown}
                onPointerMove={onSliderMove}
                onPointerUp={onSliderUp}
                onPointerCancel={onSliderUp}
                className="relative h-[clamp(115px,32vh,150px)] w-12 sm:w-14 rounded-2xl border-2 border-amber-400/60 bg-slate-950/90 backdrop-blur-md shadow-2xl cursor-pointer touch-none select-none flex flex-col justify-end p-1 overflow-hidden active:border-amber-300"
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

                {/* Physical Thumb Knob */}
                <div
                  className="absolute left-1 right-1 h-5 -translate-y-1/2 rounded-lg border-2 border-white bg-slate-900 shadow-xl flex items-center justify-center pointer-events-none transition-all duration-75"
                  style={{ bottom: `${throttlePercent}%` }}
                >
                  <div className="w-4 h-1 rounded-full bg-amber-400" />
                </div>

                {/* Reference Track Markings */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-2 px-1 text-[7px] font-mono text-slate-500 font-bold opacity-60">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
              </div>

              {/* Bottom Notch: IDLE Trigger */}
              <button
                type="button"
                onClick={() => onSliderThrottle(0)}
                className="mt-0.5 w-full py-0.5 rounded-lg border border-slate-700 bg-slate-900/80 text-[9px] font-mono font-bold text-slate-300 hover:text-white active:bg-slate-800 text-center cursor-pointer min-h-[26px]"
              >
                IDLE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameHUD
