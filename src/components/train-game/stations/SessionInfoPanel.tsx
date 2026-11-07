import React from 'react'
import {
  Clock,
  MapPin,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import type { GameStationConfig } from '../../../config/trainGameConfig'

interface SessionInfoPanelProps {
  station: GameStationConfig
  onClose: () => void
}

export const SessionInfoPanel: React.FC<SessionInfoPanelProps> = ({
  station,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg rounded-3xl border-2 bg-slate-900/95 p-6 sm:p-8 text-white shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
        style={{ borderColor: station.accentColor }}
      >
        {/* Header: Station Code & Time */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-950 font-mono font-black text-sm shadow-md"
              style={{ backgroundColor: station.accentColor }}
            >
              0{station.number}
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-slate-400 font-bold">
                {station.code} · <span className="text-amber-400">{station.day}</span>
              </p>
              <p className="font-sans font-bold text-base text-white">
                {station.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 font-mono text-xs font-bold tracking-wide text-white shadow-sm"
              style={{
                borderColor: `${station.accentColor}66`,
                backgroundColor: `${station.accentColor}22`,
              }}
            >
              <Clock className="h-3.5 w-3.5" style={{ color: station.accentColor }} />
              {station.time}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Session Panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider font-semibold"
              style={{
                borderColor: `${station.accentColor}88`,
                color: station.accentColor,
                backgroundColor: `${station.accentColor}15`,
              }}
            >
              {station.category}
            </span>
            <span className="font-mono text-xs text-slate-400 font-medium">
              {station.duration}
            </span>
          </div>

          <h3
            id="session-modal-title"
            className="font-sans text-2xl font-black text-white leading-tight mt-1"
          >
            {station.sessionTitle}
          </h3>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed font-sans font-normal">
            {station.description}
          </p>

          {/* Venue & Node Details */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-rose-400 shrink-0" />
              <span className="text-white font-medium">{station.venue}</span>
            </div>
            <span className="text-slate-400 font-bold">
              Station {station.number} of 8
            </span>
          </div>
        </div>

        {/* Footer: Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Ready to continue</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-wider text-slate-950 hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-lg font-black"
            style={{ backgroundColor: station.accentColor }}
          >
            <span>Return to Cabin</span>
            <ArrowRight className="h-4 w-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionInfoPanel
