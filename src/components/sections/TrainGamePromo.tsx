import React from 'react'
import { ArrowRight } from 'lucide-react'

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
      {/* ── Main Editorial Content (Clean Headline & Action, No Clutter) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-10 py-1">
        <div className="max-w-3xl">
          {/* Main Headline */}
          <h3 className="font-display font-normal uppercase text-white tracking-[-0.015em] text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.02]">
            WHY SCROLL THROUGH THE SCHEDULE WHEN YOU CAN RIDE THROUGH IT?
          </h3>
        </div>

        {/* CTA Button: GET INTO THE LOCO → */}
        <div className="shrink-0 pt-1 lg:pt-0">
          <button
            type="button"
            onClick={onPlayGame}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-7 sm:px-9 py-4 font-sans text-xs sm:text-sm font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,255,255,0.18)] hover:shadow-[0_0_35px_rgba(255,255,255,0.32)] hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <span>LETS DRIVE THE TRAIN</span>
            <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>

      {/* ── Bottom Subtle Accent Line Separator ── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent mt-6 sm:mt-8" aria-hidden="true" />
    </div>
  )
}

export default TrainGamePromo
