import React from 'react'

/**
 * Deep Space Cosmic Nebula & Environmental Atmosphere.
 * Strictly background layer; remains outside the stationary Hourglass.
 */
export const CosmicNebula: React.FC = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Deep Space Foundation */}
      <div className="absolute inset-0 bg-[#08070D]" />

      {/* Primary Violet Nebula Glow Cloud */}
      <div className="absolute top-1/4 left-1/2 h-[650px] w-[950px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-violet-600/12 via-purple-900/6 to-transparent blur-[160px]" />

      {/* Secondary Cosmic Indigo/Violet Ambient Cloud */}
      <div className="absolute top-1/2 right-10 h-[500px] w-[600px] -translate-y-1/3 rounded-full bg-gradient-radial from-indigo-600/8 via-violet-950/4 to-transparent blur-[140px]" />

      {/* Champagne Gold Ambient Hearth (Soft warm backlight behind the sand) */}
      <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-amber-500/5 via-amber-700/2 to-transparent blur-[100px]" />

      {/* Subtle Stardust Micro-particles outside the hourglass */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Technical Fine Grid Overlay */}
      <div className="absolute inset-0 bg-grid-tech opacity-30" />
    </div>
  )
}

export default CosmicNebula
