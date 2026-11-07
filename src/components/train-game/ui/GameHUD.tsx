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
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 backdrop-blur-md px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Website</span>
        </button>

        {/* Center Station Proximity Pill */}
        <div className="hidden sm:flex items-center gap-3 rounded-full border border-white/15 bg-black/75 backdrop-blur-md px-5 py-2 font-mono text-xs text-white shadow-lg">
          <Navigation className="h-3.5 w-3.5 text-white animate-pulse" />
          <span>
            {isAtStation
              ? `AT PLATFORM: ${activeStation?.name.toUpperCase()}`
              : `NEXT STOP: ${nextStation.name.toUpperCase()}`}
          </span>
          <span className="text-[#888888]">·</span>
          <span className="text-white font-bold">{`${distanceMeters}m`}</span>
        </div>

        {/* Pause Button */}
        <button
          type="button"
          onClick={onTogglePause}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/70 backdrop-blur-md px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer shadow-lg"
          aria-label="Pause Game"
        >
          <Menu className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Pause</span>
        </button>
      </div>

      {/* ==================================================================
          2. CENTER NOTIFICATIONS: APPROACHING & STATION ARRIVAL
          ================================================================== */}
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Approaching Station Banner */}
        {isApproaching && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-200 rounded-full border border-white/30 bg-black/85 backdrop-blur-md px-6 py-2.5 text-xs font-mono uppercase tracking-wider text-white shadow-2xl flex items-center gap-2.5">
            <Compass className="h-4 w-4 text-white" />
            <span>APPROACHING PLATFORM: {nextStation.name}</span>
            <span className="text-white font-bold">{distanceMeters}m</span>
            <span className="text-[#A0A0A0]">(Prepare Brakes)</span>
          </div>
        )}

        {/* Arrived at Platform Notification — [E] Explore Session */}
        {isAtStation && activeStation && (
          <div className="animate-in fade-in zoom-in-95 duration-200 pointer-events-auto rounded-3xl border-2 border-white bg-black/90 backdrop-blur-xl p-5 sm:p-6 text-center shadow-[0_15px_40px_rgba(255,255,255,0.15)] max-w-md">
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-mono uppercase text-[#A0A0A0]">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Station Platform Stopping Zone</span>
            </div>
            <h4 className="font-sans text-lg sm:text-xl font-black text-white uppercase tracking-tight">
              {activeStation.name}
            </h4>
            <p className="font-mono text-xs text-[#D0D0D0] mt-0.5">
              {activeStation.time} · {activeStation.sessionTitle}
            </p>

            <button
              type="button"
              onClick={onOpenSessionModal}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 font-sans text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#EAEAEA] active:scale-95 transition-all shadow-xl cursor-pointer"
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
        <div className="hidden lg:flex flex-col gap-1 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-md p-3.5 font-mono text-[11px] text-[#A0A0A0]">
          <div className="text-white font-bold mb-0.5">LOCOMOTIVE CONTROLS</div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">W / ↑</kbd>
            <span>Throttle Up</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">S / ↓</kbd>
            <span>Throttle Down</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">Space</kbd>
            <span>Apply Brakes</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white border border-white/20">E</kbd>
            <span>Station Details</span>
          </div>
        </div>

        {/* Speedometer Telemetry Readout (Center / Mobile Left) */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/75 backdrop-blur-md px-5 py-3 shadow-lg">
          <div>
            <div className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">Speed</div>
            <div className="font-mono font-black text-2xl sm:text-3xl text-white leading-none">
              {Math.round(dynamics.speedKmh)}
              <span className="text-xs font-normal text-[#888888] ml-1">KM/H</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/20" />
          <div>
            <div className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">Throttle</div>
            <div className="font-mono font-bold text-sm text-white">
              {Math.round(dynamics.throttlePercent)}%
            </div>
          </div>
          <div className="h-8 w-[1px] bg-white/20" />
          <div>
            <div className="font-mono text-[10px] text-[#888888] uppercase tracking-wider">Brake</div>
            <div className={`font-mono font-bold text-sm ${dynamics.brakePercent > 10 ? 'text-white' : 'text-[#666666]'}`}>
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
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 border border-white/25 active:bg-white active:text-black text-white cursor-pointer shadow-md"
              aria-label="Throttle Up"
            >
              <ChevronUp className="h-5 w-5" />
            </button>
            <button
              type="button"
              onPointerDown={() => onMobileThrottle('down', true)}
              onPointerUp={() => onMobileThrottle('down', false)}
              onPointerLeave={() => onMobileThrottle('down', false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 border border-white/25 active:bg-white active:text-black text-white cursor-pointer shadow-md"
              aria-label="Throttle Down"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Interact (E) Button when at platform */}
          {isAtStation && (
            <button
              type="button"
              onClick={onMobileInteract}
              className="flex h-24 w-16 flex-col items-center justify-center rounded-2xl bg-white text-black font-mono font-bold text-xs uppercase cursor-pointer shadow-xl animate-pulse"
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
            className="flex h-24 w-16 flex-col items-center justify-center rounded-2xl bg-white/20 border-2 border-white/40 active:bg-white active:text-black text-white font-mono font-bold text-xs uppercase cursor-pointer shadow-xl"
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
