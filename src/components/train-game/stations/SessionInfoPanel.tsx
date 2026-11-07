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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#0d0d0d] p-6 sm:p-8 text-white shadow-2xl">
        {/* Header: Station Code & Time */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black font-mono font-black text-xs">
              0{station.number}
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[#A0A0A0]">
                {station.code} · {station.day}
              </p>
              <p className="font-sans font-bold text-sm text-white">
                {station.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white tracking-wide">
              <Clock className="h-3.5 w-3.5 text-white" />
              {station.time}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#888888] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Session Panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="py-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-md border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider text-[#D0D0D0]">
              {station.category}
            </span>
            <span className="font-mono text-xs text-[#777777]">
              {station.duration}
            </span>
          </div>

          <h3
            id="session-modal-title"
            className="font-sans text-2xl font-black text-white leading-tight mt-1"
          >
            {station.sessionTitle}
          </h3>

          <p className="mt-3 text-sm text-[#B0B0B0] leading-relaxed">
            {station.description}
          </p>

          {/* Venue & Node Details */}
          <div className="mt-5 pt-4 border-t border-[#1c1c1c] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#888888]">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#E0E0E0] shrink-0" />
              <span className="text-white font-medium">{station.venue}</span>
            </div>
            <span className="text-[#666666]">
              Station {station.number} of 8
            </span>
          </div>
        </div>

        {/* Footer: Action Buttons */}
        <div className="pt-4 border-t border-[#222222] flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#777777]">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span>Ready to continue</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 text-xs sm:text-sm font-sans font-bold uppercase tracking-wider hover:bg-[#EAEAEA] active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <span>Return to Cabin</span>
            <ArrowRight className="h-4 w-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SessionInfoPanel
