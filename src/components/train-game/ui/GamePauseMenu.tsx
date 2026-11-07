import React from 'react'
import {
  Play,
  RotateCcw,
  Home,
  Navigation,
  X,
  MapPin,
  Sliders,
  Activity,
  Zap,
} from 'lucide-react'
import { GAME_STATIONS } from '../../../config/trainGameConfig'
import type { GraphicsQuality } from '../graphics/graphicsProfiles'

interface GamePauseMenuProps {
  onResume: () => void
  onRestart: () => void
  onReturnToWebsite: () => void
  onJumpToStation: (stationNumber: number) => void
  quality: GraphicsQuality
  onSelectQuality: (q: GraphicsQuality) => void
  showFps: boolean
  onToggleFps: (val: boolean) => void
  autoQuality: boolean
  onToggleAutoQuality: (val: boolean) => void
}

export const GamePauseMenu: React.FC<GamePauseMenuProps> = ({
  onResume,
  onRestart,
  onReturnToWebsite,
  onJumpToStation,
  quality,
  onSelectQuality,
  showFps,
  onToggleFps,
  autoQuality,
  onToggleAutoQuality,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-menu-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-3xl border-2 border-sky-400/40 bg-slate-900/95 p-5 sm:p-7 text-white shadow-[0_20px_60px_rgba(2,6,23,0.7)] my-auto max-h-[92vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 shrink-0">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-sky-400 font-bold">
              SIMULATION PAUSED
            </span>
            <h3 id="pause-menu-title" className="font-sans text-xl sm:text-2xl font-black text-white">
              IDEA SPRINT <span className="text-amber-400">EXPRESS</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onResume}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Resume Game"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Center Content */}
        <div className="overflow-y-auto py-3 space-y-4 pr-1">
          {/* 1. Mobile Graphics & Battery Profiles */}
          <div className="rounded-2xl border border-sky-500/20 bg-slate-950/70 p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <span className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-sky-400">
                <Sliders className="h-3.5 w-3.5" />
                <span>Graphics & Battery Profile</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Current: <strong className="text-amber-400 uppercase">{quality}</strong>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onSelectQuality('low')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  quality === 'low'
                    ? 'border-emerald-400 bg-emerald-950/70 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-mono text-xs font-black uppercase text-emerald-300">LOW</span>
                <span className="text-[10px] font-sans text-slate-300 line-clamp-1">Max Battery</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectQuality('medium')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  quality === 'medium'
                    ? 'border-amber-400 bg-amber-950/70 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-mono text-xs font-black uppercase text-amber-300">MEDIUM</span>
                <span className="text-[10px] font-sans text-slate-300 line-clamp-1">Balanced</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectQuality('high')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  quality === 'high'
                    ? 'border-sky-400 bg-sky-950/70 text-white shadow-lg'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                <span className="font-mono text-xs font-black uppercase text-sky-300">HIGH</span>
                <span className="text-[10px] font-sans text-slate-300 line-clamp-1">Full Detail</span>
              </button>
            </div>

            {/* Performance options row */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoQuality}
                  onChange={(e) => onToggleAutoQuality(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" />
                  <span>Auto-adapt to prevent lag</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFps}
                  onChange={(e) => onToggleFps(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-sky-400 focus:ring-0"
                />
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-sky-400" />
                  <span>Show FPS</span>
                </span>
              </label>
            </div>
          </div>

          {/* 2. Route Overview & Direct Station Jumps */}
          <div>
            <div className="flex items-center justify-between mb-2 text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Navigation className="h-3.5 w-3.5" />
                <span>Railway Stations (Tap to Warp)</span>
              </span>
              <span className="text-amber-400 font-bold">8 Stops</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 sm:max-h-52 overflow-y-auto pr-1">
              {GAME_STATIONS.map((stn) => (
                <button
                  key={stn.id}
                  type="button"
                  onClick={() => {
                    onJumpToStation(stn.number)
                    onResume()
                  }}
                  className="flex items-start justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-sky-400 hover:bg-slate-800/80 text-left transition-all cursor-pointer group min-h-[44px]"
                >
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span
                        className="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-black text-slate-950"
                        style={{ backgroundColor: stn.accentColor }}
                      >
                        0{stn.number}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {stn.name}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                        {stn.time}
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
        </div>

        {/* Action Buttons Row */}
        <div className="pt-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-mono font-bold uppercase text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="h-3.5 w-3.5 text-sky-400" />
              <span>Restart</span>
            </button>
            <button
              type="button"
              onClick={onReturnToWebsite}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-mono font-bold uppercase text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer min-h-[44px]"
            >
              <Home className="h-3.5 w-3.5 text-sky-400" />
              <span>Exit</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onResume}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 px-6 py-2.5 text-xs sm:text-sm font-sans font-black uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all shadow-xl cursor-pointer min-h-[44px]"
          >
            <Play className="h-4 w-4 fill-slate-950 text-slate-950" />
            <span>Resume</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GamePauseMenu
