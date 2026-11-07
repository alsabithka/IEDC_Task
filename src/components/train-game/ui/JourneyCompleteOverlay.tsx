import React from 'react'
import {
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { GAME_STATIONS } from '../../../config/trainGameConfig'

interface JourneyCompleteOverlayProps {
  onRestart: () => void
  onReturnToWebsite: () => void
  onRegister?: () => void
}

export const JourneyCompleteOverlay: React.FC<JourneyCompleteOverlayProps> = ({
  onRestart,
  onReturnToWebsite,
  onRegister,
}) => {
  const handleRegister = () => {
    if (onRegister) {
      onRegister()
    } else {
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/train-game')) {
        window.history.pushState({}, '', '/')
      } else {
        window.location.hash = ''
      }
      onReturnToWebsite()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-ended-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-500"
    >
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-amber-400/60 bg-slate-900/95 p-6 sm:p-10 text-white shadow-[0_25px_70px_rgba(245,158,11,0.3)] text-center">
        {/* Celebratory Trophy Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.4)]">
          <Trophy className="h-8 w-8 text-slate-950" />
        </div>

        {/* Identification Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            FINAL DESTINATION · GRAND TERMINUS
          </span>
        </div>

        {/* Main Heading: JOURNEY ENDED */}
        <h2
          id="journey-ended-title"
          className="font-display font-normal uppercase text-white tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[0.95]"
        >
          JOURNEY <span className="text-amber-400">ENDED</span>
        </h2>

        {/* Supporting Message */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 font-sans font-medium leading-relaxed max-w-md mx-auto">
          You&apos;ve reached the final destination. Thanks for travelling with IDEA SPRINT EXPRESS!
        </p>

        {/* Visited Stations Milestone Track Summary */}
        <div className="mt-6 mb-7 p-4 rounded-2xl border border-slate-800 bg-slate-950/70 text-left">
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span className="text-sky-400 font-bold">Completed Route</span>
            <span className="text-amber-400 font-bold">8 / 8 Stations Discovered</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GAME_STATIONS.slice(0, 4).map((stn) => (
              <div key={stn.id} className="flex items-center gap-2 text-xs font-mono text-slate-200">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: stn.accentColor }}
                />
                <span className="truncate">{stn.time} {stn.name}</span>
              </div>
            ))}
            {GAME_STATIONS.slice(4, 8).map((stn) => (
              <div key={stn.id} className="flex items-center gap-2 text-xs font-mono text-slate-200">
                <CheckCircle2
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: stn.accentColor }}
                />
                <span className="truncate">{stn.time} {stn.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: REGISTER (Highlighted) + PLAY AGAIN & GO TO WEBSITE (Not Highlighted) */}
        <div className="flex flex-col items-center justify-center gap-3.5">
          {/* 1. REGISTER NOW Button — HIGHLIGHTED (Primary CTA) */}
          <button
            type="button"
            onClick={handleRegister}
            className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 py-4 px-10 font-sans text-base sm:text-lg font-black uppercase tracking-wider shadow-[0_12px_35px_rgba(245,158,11,0.5)] ring-2 ring-amber-300/80 transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="h-5 w-5 fill-slate-950 text-slate-950" />
            <span>REGISTER NOW</span>
            <ArrowRight className="h-5 w-5 text-slate-950" />
          </button>

          {/* Secondary Actions: PLAY AGAIN & GO TO WEBSITE — NOT HIGHLIGHTED */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {/* 2. PLAY AGAIN Button — NOT HIGHLIGHTED */}
            <button
              type="button"
              onClick={onRestart}
              className="w-full sm:w-auto min-w-[170px] inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-700/80 bg-slate-800/80 py-3.5 px-6 font-sans text-sm font-bold uppercase tracking-wider text-slate-300 transition-all duration-150 hover:bg-slate-700/90 hover:text-white hover:border-slate-500 active:scale-[0.98] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-slate-400" />
              <span>PLAY AGAIN</span>
            </button>

            {/* 3. GO TO WEBSITE Button — NOT HIGHLIGHTED */}
            <button
              type="button"
              onClick={onReturnToWebsite}
              className="w-full sm:w-auto min-w-[170px] inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-700/80 bg-slate-800/80 py-3.5 px-6 font-sans text-sm font-bold uppercase tracking-wider text-slate-300 transition-all duration-150 hover:bg-slate-700/90 hover:text-white hover:border-slate-500 active:scale-[0.98] cursor-pointer"
            >
              <Home className="h-4 w-4 text-slate-400" />
              <span>GO TO WEBSITE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JourneyCompleteOverlay
