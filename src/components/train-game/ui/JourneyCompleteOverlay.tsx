import React from 'react'
import {
  Trophy,
  ArrowRight,
  RotateCcw,
  Home,
  CheckCircle2,
} from 'lucide-react'
import { GAME_STATIONS } from '../../../config/trainGameConfig'

interface JourneyCompleteOverlayProps {
  onRestart: () => void
  onReturnToWebsite: () => void
}

export const JourneyCompleteOverlay: React.FC<JourneyCompleteOverlayProps> = ({
  onRestart,
  onReturnToWebsite,
}) => {
  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Navigate back to main page and scroll to #register
    window.location.hash = '#register'
    onReturnToWebsite()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="journey-ended-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-500"
    >
      <div className="relative w-full max-w-xl rounded-3xl border-2 border-amber-400/50 bg-slate-900/95 p-6 sm:p-10 text-white shadow-[0_25px_70px_rgba(245,158,11,0.25)] text-center">
        {/* Celebratory Icon */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-[0_10px_25px_rgba(245,158,11,0.4)]">
          <Trophy className="h-8 w-8 text-slate-950" />
        </div>

        {/* Identification Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            FINAL STATION REACHED · TERMINUS COMPLETE
          </span>
        </div>

        {/* Main Heading as Specified */}
        <h2
          id="journey-ended-title"
          className="font-display font-normal uppercase text-white tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[0.95]"
        >
          JOURNEY <span className="text-amber-400">ENDED</span>
        </h2>

        {/* Message as Specified */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 font-sans font-medium leading-relaxed max-w-md mx-auto">
          Every great idea begins with a journey. Thank you for travelling with Idea Sprint Express!
        </p>

        {/* Visited Stations Milestone Track Summary */}
        <div className="mt-6 mb-8 p-4 rounded-2xl border border-slate-800 bg-slate-950/70 text-left">
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span className="text-sky-400 font-bold">Completed Itinerary</span>
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

        {/* Two Prominent Action Buttons as Specified */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          {/* Primary Action Button: REGISTER NOW */}
          <a
            href="#register"
            onClick={handleRegisterClick}
            className="w-full sm:w-auto min-w-[210px] inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 text-white py-4 px-8 font-sans text-sm font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(244,63,94,0.4)] transition-all duration-150 hover:scale-[1.03] active:scale-[0.98] cursor-pointer text-center"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="h-4 w-4 text-white" />
          </a>

          {/* Secondary Action Button: GO TO WEBSITE */}
          <button
            type="button"
            onClick={onReturnToWebsite}
            className="w-full sm:w-auto min-w-[190px] inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/30 bg-slate-800/80 py-4 px-7 font-sans text-sm font-bold uppercase tracking-wider text-sky-100 transition-all duration-150 hover:bg-slate-700 hover:border-sky-400 hover:text-white active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4 text-sky-400" />
            <span>GO TO WEBSITE</span>
          </button>
        </div>

        {/* Replay Option */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3 text-sky-400" />
            <span>Replay Train Journey from Station 01</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default JourneyCompleteOverlay
