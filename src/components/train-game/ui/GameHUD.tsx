import React from 'react'
import {
  Menu,
  ChevronUp,
  ChevronDown,
  Navigation,
  Compass,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import type { GameStationConfig } from '../../../config/trainGameConfig'
import type { TrainDynamics } from '../controls/useGameProgress'

interface GameHUDProps {
  dynamics: TrainDynamics
  nextStation: GameStationConfig
  distanceMeters: number
  isAtStation: boolean
  activeStation: GameStationConfig | null
  onOpenSessionModal: () => void
  onTogglePause: () => void
  onReturnToWebsite: () => void
  onMobileThrottle: (direction: 'up' | 'down', active: boolean) => void
  onMobileBrake: (active: boolean) => void
  onMobileInteract: () => void
}

export const GameHUD: React.FC<GameHUDProps> = ({
  dynamics,
  nextStation,
  distanceMeters,
  isAtStation,
  activeStation,
  onOpenSessionModal,
  onTogglePause,
  onReturnToWebsite,
  onMobileThrottle,
  onMobileBrake,
  onMobileInteract,
}) => {
  const isApproaching = distanceMeters < 45 && !isAtStation

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* ==================================================================
          1. TOP NAVIGATION & STATUS BAR
          ================================================================== */}
      <div className="flex items-center justify-between gap-4 pointer-events-auto">
        {/* Back to Website Button */}
        <button
          type="button"
          onClick={onReturnToWebsite}
          className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-slate-950/80 backdrop-blur-md px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 hover:border-sky-400 hover:text-white transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-sky-400" />
          <span>Back to Website</span>
        </button>

        {/* Center Station Proximity Pill */}
        <div
          className="hidden sm:flex items-center gap-3 rounded-full border bg-slate-950/85 backdrop-blur-md px-5 py-2 font-mono text-xs text-white shadow-lg transition-colors"
          style={{
            borderColor: isAtStation && activeStation ? activeStation.accentColor : '#38BDF8',
          }}
        >
          <Navigation
            className="h-3.5 w-3.5 animate-pulse"
            style={{
              color: isAtStation && activeStation ? activeStation.accentColor : '#38BDF8',
            }}
          />
          <span className="font-bold">
            {isAtStation
              ? `AT PLATFORM: ${activeStation?.name.toUpperCase()}`
              : `NEXT STOP: ${nextStation.name.toUpperCase()}`}
          </span>
          <span className="text-slate-500">·</span>
          <span
            className="font-bold"
            style={{
              color: isAtStation && activeStation ? activeStation.accentColor : '#FACC15',
            }}
          >
            {`${distanceMeters}m`}
          </span>
        </div>

        {/* Pause Button */}
        <button
          type="button"
          onClick={onTogglePause}
          className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-slate-950/80 backdrop-blur-md px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-sky-100 hover:bg-slate-900 hover:border-sky-400 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Pause Game"
        >
          <Menu className="h-3.5 w-3.5 text-sky-400" />
          <span className="hidden sm:inline">Pause</span>
        </button>
      </div>

      {/* ==================================================================
          2. CENTER NOTIFICATIONS: APPROACHING & STATION ARRIVAL
          ================================================================== */}
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Approaching Station Banner */}
        {isApproaching && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200 rounded-full border-2 border-amber-400 bg-slate-950/90 backdrop-blur-md px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white shadow-[0_8px_30px_rgba(245,158,11,0.3)] flex items-center gap-2.5">
            <Compass className="h-4 w-4 text-amber-400 animate-spin" />
            <span>APPROACHING PLATFORM: {nextStation.name}</span>
            <span className="text-amber-300 font-bold">{distanceMeters}m</span>
            <span className="text-amber-200/70 font-semibold">(Apply Brakes)</span>
          </div>
        )}

        {/* Arrived at Platform Notification — [E] Explore Session */}
        {isAtStation && activeStation && (
          <div
            className="animate-in fade-in zoom-in-95 duration-200 pointer-events-auto rounded-3xl border-2 bg-slate-950/95 backdrop-blur-xl p-5 sm:p-6 text-center shadow-[0_15px_45px_rgba(0,0,0,0.5)] max-w-md"
            style={{ borderColor: activeStation.accentColor }}
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-mono uppercase text-slate-300">
              <Sparkles className="h-3.5 w-3.5" style={{ color: activeStation.accentColor }} />
              <span>Platform Safe Stopping Zone</span>
            </div>
            <h4 className="font-sans text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {activeStation.name}
            </h4>
            <p className="font-mono text-xs text-slate-300 mt-0.5">
              <span className="text-amber-400 font-bold">{activeStation.time}</span> · {activeStation.sessionTitle}
            </p>

            <button
              type="button"
              onClick={onOpenSessionModal}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-6 py-3 font-sans text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950 hover:opacity-95 active:scale-95 transition-all shadow-xl cursor-pointer"
              style={{ backgroundColor: activeStation.accentColor }}
            >
              <span>[E] Explore Session Details</span>
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================
          3. BOTTOM DRIVING CONTROLS & DESKTOP TELEMETRY
          ================================================================== */}
      <div className="flex items-end justify-between gap-4">
        {/* Desktop Controls Hint (Left) */}
        <div className="hidden lg:flex flex-col gap-1 rounded-2xl border border-sky-500/20 bg-slate-950/75 backdrop-blur-md p-3.5 font-mono text-[11px] text-slate-300 shadow-xl">
          <div className="text-sky-400 font-bold mb-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LOCOMOTIVE CONTROLS</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-200 border border-sky-700/60 font-bold">W / ↑</kbd>
            <span>Throttle Up</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-200 border border-sky-700/60 font-bold">S / ↓</kbd>
            <span>Throttle Down</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-200 border border-rose-700/60 font-bold">Space</kbd>
            <span>Apply Brakes</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-200 border border-amber-700/60 font-bold">E</kbd>
            <span>Station Details</span>
          </div>
        </div>

        {/* Speedometer Telemetry Readout (Center / Mobile Left) */}
        <div className="flex items-center gap-3 rounded-2xl border border-sky-400/30 bg-slate-950/85 backdrop-blur-md px-5 py-3 shadow-2xl">
          <div>
            <div className="font-mono text-[10px] text-sky-400 uppercase tracking-wider font-bold">Speed</div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-emerald-400 leading-none">
              {Math.round(dynamics.speedKmh)}
              <span className="text-xs font-normal text-emerald-500 ml-1">KM/H</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div>
            <div className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-bold">Throttle</div>
            <div className="font-mono font-bold text-sm text-amber-300">
              {Math.round(dynamics.throttlePercent)}%
            </div>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div>
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider font-bold">Brake</div>
            <div className={`font-mono font-bold text-sm ${dynamics.brakePercent > 10 ? 'text-rose-400 animate-pulse' : 'text-slate-500'}`}>
              {dynamics.brakePercent > 10 ? 'ACTIVE' : 'OFF'}
            </div>
          </div>
        </div>

        {/* Mobile On-Screen Touch Controls (Right) */}
        <div className="flex md:hidden items-center gap-2 pointer-events-auto">
          {/* Throttle Controls */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onPointerDown={() => onMobileThrottle('up', true)}
              onPointerUp={() => onMobileThrottle('up', false)}
              onPointerLeave={() => onMobileThrottle('up', false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600/80 border border-emerald-400 active:bg-emerald-500 text-white cursor-pointer shadow-lg"
              aria-label="Throttle Up"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              type="button"
              onPointerDown={() => onMobileThrottle('down', true)}
              onPointerUp={() => onMobileThrottle('down', false)}
              onPointerLeave={() => onMobileThrottle('down', false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-600 active:bg-slate-700 text-white cursor-pointer shadow-lg"
              aria-label="Throttle Down"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Interact (E) Button when at platform */}
          {isAtStation && activeStation && (
            <button
              type="button"
              onClick={onMobileInteract}
              className="flex h-24 w-16 flex-col items-center justify-center rounded-2xl font-mono font-black text-xs uppercase cursor-pointer shadow-xl text-slate-950 animate-bounce"
              style={{ backgroundColor: activeStation.accentColor }}
              aria-label="Interact with Station"
            >
              <span>[E]</span>
              <span className="text-[9px]">INFO</span>
            </button>
          )}

          {/* Large Brake Touch Pad */}
          <button
            type="button"
            onPointerDown={() => onMobileBrake(true)}
            onPointerUp={() => onMobileBrake(false)}
            onPointerLeave={() => onMobileBrake(false)}
            className="flex h-24 w-16 flex-col items-center justify-center rounded-2xl bg-rose-600/80 border-2 border-rose-400 active:bg-rose-500 text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-xl"
            aria-label="Apply Brake"
          >
            <span>BRAKE</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameHUD
