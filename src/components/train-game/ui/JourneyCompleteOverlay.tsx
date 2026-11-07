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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-500"
    >
      <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-[#0a0a0a] p-6 sm:p-10 text-white shadow-2xl text-center">
        {/* Celebratory Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
          <Trophy className="h-8 w-8 text-black" />
        </div>

        {/* Identification Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D0D0D0]">
            FINAL STATION REACHED · TERMINUS COMPLETE
          </span>
        </div>

        {/* Main Heading as Specified */}
        <h2
          id="journey-ended-title"
          className="font-display font-normal uppercase text-white tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[0.95]"
        >
          JOURNEY ENDED
        </h2>

        {/* Message as Specified */}
        <p className="mt-4 text-sm sm:text-base text-[#C0C0C0] font-sans font-medium leading-relaxed max-w-md mx-auto">
          Every great idea begins with a journey. Thank you for travelling with Idea Sprint Express!
        </p>

        {/* Visited Stations Milestone Track Summary */}
        <div className="mt-6 mb-8 p-4 rounded-2xl border border-[#222222] bg-[#111111] text-left">
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono uppercase tracking-wider text-[#888888]">
            <span>Completed Itinerary</span>
            <span>8 / 8 Stations Discovered</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {GAME_STATIONS.slice(0, 4).map((stn) => (
              <div key={stn.id} className="flex items-center gap-2 text-xs font-mono text-[#D0D0D0]">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
                <span className="truncate">{stn.time} {stn.name}</span>
              </div>
            ))}
            {GAME_STATIONS.slice(4, 8).map((stn) => (
              <div key={stn.id} className="flex items-center gap-2 text-xs font-mono text-[#D0D0D0]">
                <CheckCircle2 className="h-3.5 w-3.5 text-white shrink-0" />
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
            className="w-full sm:w-auto min-w-[210px] inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-black py-4 px-8 font-sans text-sm font-black uppercase tracking-wider shadow-xl transition-all duration-150 hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center"
          >
            <span>REGISTER NOW</span>
            <ArrowRight className="h-4 w-4 text-black" />
          </a>

          {/* Secondary Action Button: GO TO WEBSITE */}
          <button
            type="button"
            onClick={onReturnToWebsite}
            className="w-full sm:w-auto min-w-[190px] inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 py-4 px-7 font-sans text-sm font-bold uppercase tracking-wider text-white transition-all duration-150 hover:bg-white/10 hover:border-white/40 active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>GO TO WEBSITE</span>
          </button>
        </div>

        {/* Replay Option */}
        <div className="mt-5">
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#777777] hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Replay Train Journey from Station 01</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default JourneyCompleteOverlay
