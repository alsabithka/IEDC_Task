import React from 'react'
import { ArrowRight, Train } from 'lucide-react'

export interface TrainGamePromoProps {
  onPlayGame: () => void
  className?: string
}

export const TrainGamePromo: React.FC<TrainGamePromoProps> = ({
  onPlayGame,
  className = '',
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      {/* ── Top Attractive Railway Line Accent ── */}
      <div className="relative flex items-center justify-between gap-4 mb-6 sm:mb-8" aria-hidden="true">
        {/* Track Line Left */}
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/25 to-white/40" />

        {/* Center Railway Badge Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/15 bg-[#0a0a0a] text-white/70 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-[0.22em] shrink-0">
          <Train className="h-3 w-3 text-white" />
          <span>IDEA SPRINT EXPRESS</span>
        </div>

        {/* Track Line Right */}
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/25 to-white/40" />
      </div>

      {/* ── Main Editorial Content (No Enclosing Box) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 py-1">
        <div className="max-w-3xl">
          {/* Eyebrow Label */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.24em] text-[#888888]">
              INTERACTIVE 3D SIMULATION
            </span>
          </div>

          {/* Main Headline */}
          <h3 className="font-display font-normal uppercase text-white tracking-[-0.015em] text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.02]">
            WHY SCROLL THROUGH THE SCHEDULE WHEN YOU CAN RIDE THROUGH IT?
          </h3>

          {/* Supporting Text */}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-[#A0A0A0] font-sans font-medium leading-relaxed max-w-2xl">
            The sessions are your stations. The tracks are waiting. Take the driver&apos;s seat and experience IDEA SPRINT differently.
          </p>
        </div>

        {/* CTA Button: GET INTO THE LOCO → */}
        <div className="shrink-0 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={onPlayGame}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-7 sm:px-9 py-4 font-sans text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:shadow-[0_0_35px_rgba(255,255,255,0.32)] hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>GET INTO THE LOCO</span>
            <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* ── Bottom Attractive Railway Line Accent ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6 sm:mt-8" aria-hidden="true" />
    </div>
  )
}

export default TrainGamePromo
