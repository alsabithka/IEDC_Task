import React from 'react'
import { Play, Sparkles, Navigation, Gauge } from 'lucide-react'

interface TrainGameInvitationProps {
  onPlayGame: () => void
  className?: string
}

export const TrainGameInvitation: React.FC<TrainGameInvitationProps> = ({
  onPlayGame,
  className = '',
}) => {
  return (
    <div className={`w-full rounded-3xl border border-white/20 bg-gradient-to-b from-[#111111] to-[#080808] p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden ${className}`}>
      {/* Decorative Background Tech Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:3rem_3rem]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="max-w-2xl">
          {/* Eyebrow Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#D0D0D0]">
              INTERACTIVE 3D EXPERIENCE · FIRST-PERSON SIMULATION
            </span>
          </div>

          {/* Main Headline */}
          <h3 className="font-display font-normal uppercase text-white tracking-[-0.015em] text-3xl sm:text-5xl lg:text-6xl leading-[0.95]">
            ALL ABOARD.
          </h3>

          <p className="mt-2 font-mono text-sm sm:text-base font-bold text-white uppercase tracking-wider">
            IDEA SPRINT EXPRESS
          </p>

          <p className="mt-3 text-sm sm:text-base text-[#A0A0A0] font-sans font-medium leading-relaxed">
            Take control of the Idea Sprint Express from the driver&apos;s seat. Drive through the complete railway world and discover every official event session along the track.
          </p>

          {/* Feature Highlights */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-mono text-[#888888]">
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5 text-white" />
              <span>Realistic Cab Controls</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-white" />
              <span>8 Event Stations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>First-Person 3D</span>
            </div>
          </div>
        </div>

        {/* Action Button & Stylized Locomotive Graphic */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
          <button
            type="button"
            onClick={onPlayGame}
            className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-3 rounded-full bg-white text-black py-4 px-9 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-2xl transition-all duration-150 hover:bg-[#EAEAEA] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Play className="h-5 w-5 fill-black text-black" />
            <span>PLAY 3D GAME</span>
          </button>

          <span className="text-[11px] font-mono text-[#666666]">
            Separate Game Engine · Instant Loading
          </span>
        </div>
      </div>
    </div>
  )
}

export default TrainGameInvitation
