import React from 'react'
import {
  Play,
  RotateCcw,
  Home,
  Navigation,
  X,
  MapPin,
} from 'lucide-react'
import { GAME_STATIONS } from '../../../config/trainGameConfig'

interface GamePauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onReturnToWebsite: () => void
  onJumpToStation: (stationNumber: number) => void
}

export const GamePauseMenu: React.FC<GamePauseMenuProps> = ({
  onResume,
  onRestart,
  onReturnToWebsite,
  onJumpToStation,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-menu-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#0c0c0c] p-6 sm:p-8 text-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#A0A0A0]">
              SIMULATION PAUSED
            </span>
            <h3 id="pause-menu-title" className="font-sans text-2xl font-black text-white">
              IDEA SPRINT EXPRESS
            </h3>
          </div>
          <button
            type="button"
            onClick={onResume}
            className="p-2 rounded-full text-[#888888] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Resume Game"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Route Overview & Direct Station Jumps */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider text-[#888888]">
            <span className="flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5" />
              <span>Railway Route Stations (Click to Jump)</span>
            </span>
            <span>8 Stations Total</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {GAME_STATIONS.map((stn) => (
              <button
                key={stn.id}
                type="button"
                onClick={() => {
                  onJumpToStation(stn.number)
                  onResume()
                }}
                className="flex items-start justify-between p-3 rounded-xl border border-[#222222] bg-[#141414] hover:border-white/40 hover:bg-[#1a1a1a] text-left transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold text-white">
                      0{stn.number} · {stn.time}
                    </span>
                    <span className="text-[10px] font-mono text-[#777777] uppercase">
                      {stn.day}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-[#D0D0D0] group-hover:text-white line-clamp-1">
                    {stn.sessionTitle}
                  </p>
                </div>
                <MapPin className="h-3.5 w-3.5 text-[#666666] group-hover:text-white shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-5 border-t border-[#222222] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-mono font-bold uppercase text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Restart Run</span>
            </button>
            <button
              type="button"
              onClick={onReturnToWebsite}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-mono font-bold uppercase text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Home className="h-3.5 w-3.5" />
              <span>Exit to Website</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-2.5 text-xs sm:text-sm font-sans font-black uppercase tracking-wider hover:bg-[#EAEAEA] active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <Play className="h-4 w-4 fill-black text-black" />
            <span>Resume Driving</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GamePauseMenu
