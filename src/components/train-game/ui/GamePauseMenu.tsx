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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-sky-400/40 bg-slate-900/95 p-6 sm:p-8 text-white shadow-[0_20px_60px_rgba(2,6,23,0.7)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-sky-400 font-bold">
              SIMULATION PAUSED
            </span>
            <h3 id="pause-menu-title" className="font-sans text-2xl font-black text-white">
              IDEA SPRINT <span className="text-amber-400">EXPRESS</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onResume}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Resume Game"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Route Overview & Direct Station Jumps */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5 text-sky-400">
              <Navigation className="h-3.5 w-3.5" />
              <span>Railway Route Stations (Click to Jump)</span>
            </span>
            <span className="text-amber-400 font-bold">8 Stations Total</span>
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
                className="flex items-start justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-sky-400 hover:bg-slate-800/80 text-left transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-black text-slate-950"
                      style={{ backgroundColor: stn.accentColor }}
                    >
                      0{stn.number}
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {stn.time}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      {stn.day}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-slate-300 group-hover:text-white line-clamp-1 font-medium">
                    {stn.sessionTitle}
                  </p>
                </div>
                <MapPin
                  className="h-3.5 w-3.5 shrink-0 mt-0.5"
                  style={{ color: stn.accentColor }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-mono font-bold uppercase text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-sky-400" />
              <span>Restart Run</span>
            </button>
            <button
              type="button"
              onClick={onReturnToWebsite}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-xs font-mono font-bold uppercase text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <Home className="h-3.5 w-3.5 text-sky-400" />
              <span>Exit to Website</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 px-7 py-2.5 text-xs sm:text-sm font-sans font-black uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <Play className="h-4 w-4 fill-slate-950 text-slate-950" />
            <span>Resume Driving</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GamePauseMenu
