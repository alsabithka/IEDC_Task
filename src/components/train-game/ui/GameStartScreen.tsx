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
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-sky-400/40 bg-slate-900/95 p-6 sm:p-10 text-white shadow-[0_20px_60px_rgba(2,6,23,0.7)] text-center">
        {/* Top Back Button */}
        <div className="flex justify-start mb-4">
          <button
            type="button"
            onClick={onReturnToWebsite}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Main Website</span>
          </button>
        </div>

        {/* Identification Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-amber-400">
            3D CARTOON RAILWAY ADVENTURE
          </span>
        </div>

        {/* Main Headline */}
        <h2 className="font-display font-normal uppercase text-white tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[0.93]">
          IDEA SPRINT <span className="text-amber-400">EXPRESS</span>
        </h2>

        {/* Introduction */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 font-sans font-medium leading-relaxed max-w-md mx-auto">
          Step into the driver&apos;s cab and journey through a vibrant cartoon world. Drive along scenic tracks, cross river bridges, and discover all 8 official stations!
        </p>

        {/* Controls Quick Guide */}
        <div className="mt-6 mb-8 rounded-2xl border border-sky-500/25 bg-slate-950/70 p-4 text-left">
          <div className="text-[11px] font-mono uppercase tracking-wider text-sky-400 mb-2.5 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span>Driver Controls</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs font-mono text-slate-200">
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">W / ↑</kbd>
              <span>Throttle Up</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600 font-bold">S / ↓</kbd>
              <span>Throttle Down</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">Space</kbd>
              <span>Apply Brakes</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold">E</kbd>
              <span>Station Details</span>
            </div>
          </div>
        </div>

        {/* Prominent Action Button: START ENGINE */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={onStartEngine}
            className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 text-white py-4 px-9 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(244,63,94,0.4)] transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Play className="h-4 w-4 fill-white text-white" />
            <span>START ENGINE & DRIVE</span>
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
          <Navigation className="h-3 w-3 text-sky-400" />
          <span>Starting at Station 01: Departure Platform</span>
        </div>
      </div>
    </div>
  )
}

export default GameStartScreen
