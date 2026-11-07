import React from 'react'
import {
  Play,
  ArrowLeft,
  Navigation,
} from 'lucide-react'

interface GameStartScreenProps {
  onStartEngine: () => void
  onReturnToWebsite: () => void
}

export const GameStartScreen: React.FC<GameStartScreenProps> = ({
  onStartEngine,
  onReturnToWebsite,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-[#0c0c0c] p-6 sm:p-10 text-white shadow-2xl text-center">
        {/* Top Back Button */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={onReturnToWebsite}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#888888] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Main Website</span>
          </button>
        </div>

        {/* Identification Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#D0D0D0]">
            FIRST-PERSON 3D TRAIN SIMULATION
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-display font-normal uppercase text-white tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[0.93]">
          IDEA SPRINT EXPRESS
        </h2>

        {/* Introduction */}
        <p className="mt-4 text-sm sm:text-base text-[#B0B0B0] font-sans font-medium leading-relaxed max-w-md mx-auto">
          Take control of the Idea Sprint Express from the driver&apos;s seat. Throttle, brake, and navigate through the 8 official stations of the 24-hour ideathon.
        </p>

        {/* Controls Quick Guide */}
        <div className="mt-6 mb-8 rounded-2xl border border-[#222222] bg-[#111111] p-4 text-left">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#888888] mb-2.5">
            Driver Controls
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#D0D0D0]">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-bold">W / ↑</kbd>
              <span>Throttle Up</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-bold">S / ↓</kbd>
              <span>Throttle Down</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-bold">Space</kbd>
              <span>Brakes</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-bold">E</kbd>
              <span>Station Details</span>
            </div>
          </div>
        </div>

        {/* Prominent Action Button: START ENGINE */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartEngine}
            className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-3 rounded-full bg-white text-black py-4 px-9 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-2xl transition-all duration-150 hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="h-4 w-4 fill-black text-black" />
            <span>START ENGINE & DRIVE</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-[#666666]">
          <Navigation className="h-3 w-3" />
          <span>Starting at Station 01: Departure Platform</span>
        </div>
      </div>
    </div>
  )
}

export default GameStartScreen
