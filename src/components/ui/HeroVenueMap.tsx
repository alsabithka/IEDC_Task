import React from 'react'
import { MapPin, ArrowUpRight, Compass } from 'lucide-react'
import { EVENT_CONFIG } from '../../data/eventConfig'

export interface HeroVenueMapProps {
  className?: string
}

/**
 * ============================================================================
 * HERO VENUE MAP COMPONENT — IEDC IDEA SPRINT 2026
 * ============================================================================
 * Premium dark-themed venue map panel integrated into the hero section.
 * - Accurate cartography of College of Engineering Chengannur (SH 1, Engineering College Rd)
 * - Exact Google Maps navigation link with Plus Code 8J88+WXQ
 * - Clean editorial black-and-white visual aesthetic
 * - Fully accessible, keyboard-operable, responsive
 */
export const HeroVenueMap: React.FC<HeroVenueMapProps> = ({ className = '' }) => {
  const mapsUrl =
    EVENT_CONFIG.venue.mapsUrl ||
    'https://www.google.com/maps/search/?api=1&query=College%20of%20Engineering%20Chengannur%208J88%2BWXQ%2C%20Engineering%20College%20Road%20opp.%20FEDERALBANK%20Alapuzha%20District%2C%20SH%201%2C%20Chengannur%2C%20Kerala%20689121'

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get directions to College of Engineering Chengannur on Google Maps"
      className={`group relative flex flex-col w-full max-w-[520px] rounded-2xl border border-[#222222] bg-[#090909] overflow-hidden text-left shadow-2xl transition-all duration-300 hover:border-white/40 hover:bg-[#0d0d0d] hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer select-none ${className}`}
    >
      {/* ==================================================================
          A. MAP PREVIEW AREA (PREMIUM DARK CARTOGRAPHY)
          ================================================================== */}
      <div className="relative w-full h-44 sm:h-52 bg-[#060606] overflow-hidden border-b border-[#1b1b1b]">
        {/* Subtle Map Grid Lines */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
          aria-hidden="true"
        />

        {/* Real Geographical Vector Map Layout (Chengannur / CEC Hilltop) */}
        <svg
          viewBox="0 0 480 220"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          aria-hidden="true"
        >
          <defs>
            {/* Campus Area Glow */}
            <radialGradient id="campusGlow" cx="72%" cy="48%" r="40%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2c2c2c" />
              <stop offset="100%" stopColor="#444444" />
            </linearGradient>
          </defs>

          {/* Background Parcels & Land Details */}
          <rect x="0" y="0" width="480" height="220" fill="#070707" />

          {/* College Campus Perimeter Parcel */}
          <path
            d="M 285,45 L 435,35 L 455,145 L 310,165 Z"
            fill="url(#campusGlow)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />

          {/* College Campus Building Outlines */}
          <rect x="315" y="65" width="45" height="32" rx="2" fill="#141414" stroke="#2a2a2a" strokeWidth="1" />
          <rect x="375" y="60" width="40" height="42" rx="2" fill="#141414" stroke="#2a2a2a" strokeWidth="1" />
          <rect x="330" y="115" width="70" height="28" rx="2" fill="#141414" stroke="#2a2a2a" strokeWidth="1" />

          {/* Secondary Feeder Roads in Chengannur */}
          <path d="M 40,30 L 115,75 L 120,185 L 60,215" fill="none" stroke="#181818" strokeWidth="3" />
          <path d="M 115,75 L 210,50 L 290,45" fill="none" stroke="#1c1c1c" strokeWidth="2.5" />
          <path d="M 200,140 L 260,200 L 330,190" fill="none" stroke="#181818" strokeWidth="2" />
          <path d="M 370,160 L 390,210" fill="none" stroke="#1a1a1a" strokeWidth="2" />

          {/* Main Central Road (SH 1 / MC Road) */}
          <path
            d="M 125,0 L 115,75 L 110,135 L 95,220"
            fill="none"
            stroke="#2e2e2e"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 125,0 L 115,75 L 110,135 L 95,220"
            fill="none"
            stroke="#404040"
            strokeWidth="1.2"
            strokeDasharray="6 4"
          />

          {/* Engineering College Road (Connecting SH 1 into Campus) */}
          <path
            d="M 110,135 Q 180,135 220,110 T 310,100 L 370,95"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 110,135 Q 180,135 220,110 T 310,100 L 370,95"
            fill="none"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          {/* Landmark Marker: Opposite Federal Bank (Junction) */}
          <circle cx="110" cy="135" r="3.5" fill="#555555" stroke="#111111" strokeWidth="1.5" />
          <text x="118" y="146" fill="#888888" fontSize="8" fontFamily="monospace" fontWeight="600" letterSpacing="0.08em">
            OPP. FEDERAL BANK
          </text>

          {/* Road Label: SH 1 */}
          <text x="75" y="45" fill="#777777" fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.1em">
            SH 1 · MC ROAD
          </text>

          {/* Road Label: Engineering College Road */}
          <text x="165" y="100" fill="#999999" fontSize="7.5" fontFamily="monospace" fontWeight="bold" letterSpacing="0.08em">
            ENGINEERING COLLEGE RD →
          </text>

          {/* College Campus Area Label */}
          <text x="320" y="52" fill="#D0D0D0" fontSize="9" fontFamily="sans-serif" fontWeight="800" letterSpacing="0.06em">
            CEC CAMPUS
          </text>

          {/* Target Location Beacon (Center of Campus: 8J88+WXQ) */}
          <g transform="translate(355, 95)">
            {/* Animated Pulsing Radar Rings */}
            <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" className="animate-ping" />
            <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.25)" />
            {/* Solid Pin Core */}
            <circle cx="0" cy="0" r="5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Top Floating Badges (Cartographic HUD) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#000000]/85 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-wider text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span>VENUE RADAR</span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-[#000000]/85 backdrop-blur-md border border-white/10 text-[10px] font-mono text-[#888888]">
          <Compass className="h-3 w-3 text-white" />
          <span>9°19&apos;N 76°37&apos;E</span>
        </div>

        {/* Bottom Location Marker Pin Overlay */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-black text-[10px] font-mono font-black uppercase tracking-wider shadow-md">
          <MapPin className="h-3 w-3 text-black shrink-0" />
          <span>8J88+WXQ</span>
        </div>
      </div>

      {/* ==================================================================
          B. VENUE INFORMATION AREA
          ================================================================== */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Eyebrow Tag */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-xs bg-white" aria-hidden="true" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#A0A0A0]">
              EVENT VENUE
            </span>
          </div>

          {/* Main Institution Title */}
          <h3 className="font-sans text-base sm:text-lg font-black uppercase text-white tracking-tight leading-snug group-hover:text-white transition-colors">
            COLLEGE OF ENGINEERING<br />
            CHENGANNUR
          </h3>

          {/* Address */}
          <p className="font-sans text-xs sm:text-sm text-[#A0A0A0] mt-1.5 leading-relaxed">
            Engineering College Road, Chengannur, Kerala – 689121
          </p>

          {/* Plus Code Badge */}
          <div className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[11px] text-[#C0C0C0]">
            <span className="text-[#777777] uppercase tracking-wider text-[10px]">
              PLUS CODE:
            </span>
            <span className="font-bold text-white tracking-widest bg-white/10 px-2 py-0.5 rounded border border-white/10">
              8J88+WXQ
            </span>
          </div>
        </div>

        {/* ==================================================================
            C. DIRECTIONS ACTION AREA
            ================================================================== */}
        <div className="mt-4 pt-3 border-t border-[#1b1b1b] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white">
          <div className="inline-flex items-center gap-1.5 font-bold text-white group-hover:text-white">
            <span>GET DIRECTIONS</span>
            <ArrowUpRight className="h-4 w-4 text-white transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>

          <span className="text-[10px] text-[#666666] tracking-wider hidden sm:inline">
            GOOGLE MAPS ↗
          </span>
        </div>
      </div>
    </a>
  )
}

export const VenueMap = HeroVenueMap
export default HeroVenueMap
