import React, { useState } from 'react'
import {
  ChevronRight,
  Menu,
  X,
  Star,
  Clock,
  Ticket,
  ArrowRight,
  Play,
  MapPin,
} from 'lucide-react'

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Overview', delay: '100ms' },
    { label: 'Schedule', delay: '150ms' },
    { label: 'Tracks', delay: '200ms' },
    { label: 'Contact', delay: '250ms' },
  ]

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#080611] text-white select-none flex flex-col justify-between font-sans">
      {/* ======================================================================
          1. DEEP SPACE COSMIC BACKGROUND (Clean CSS atmosphere without video)
          ====================================================================== */}
      <div
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {/* Deep Space Obsidian Base */}
        <div className="absolute inset-0 bg-[#080611]" />

        {/* Central Violet Nebula Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[1000px] rounded-full bg-gradient-radial from-[#9b6bff]/12 via-[#6a3fd0]/5 to-transparent blur-[160px]" />

        {/* Secondary Upper Cosmic Hue */}
        <div className="absolute -top-32 right-1/4 h-[500px] w-[600px] rounded-full bg-gradient-radial from-violet-900/10 via-purple-950/4 to-transparent blur-[140px]" />

        {/* Subtle Star Particles / Cosmic Stardust */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      {/* ======================================================================
          2. BOTTOM BLUR + GLOW SCRIM (z-index 1, pointer-events-none)
          ====================================================================== */}
      {/* Bottom Blur Scrim gated by mask */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none bottom-blur-scrim"
        aria-hidden="true"
      />

      {/* Violet Floor Glow seeping up like nebula light */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none violet-floor-glow"
        aria-hidden="true"
      />

      {/* ======================================================================
          3. GRAIN OVERLAY (z-index 2, pointer-events-none, SVG feTurbulence)
          ====================================================================== */}
      <div
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* ======================================================================
          4. NAVBAR (z-index 50, relative positioned)
          ====================================================================== */}
      <header className="relative z-50 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 md:py-6">
        {/* Left: Wordmark & Category */}
        <div
          className="flex items-baseline gap-2.5 animate-blur-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <a
            href="#"
            className="font-serif text-2xl tracking-[0.02em] text-white hover:opacity-90 transition-opacity focus:outline-none"
          >
            IDEA SPRINT
          </a>
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/45">
            BOOTCAMP CEC
          </span>
        </div>

        {/* Center: Desktop Navigation Links (hidden below lg) */}
        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="Event Navigation"
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              className="text-sm text-white/60 hover:text-white transition-colors duration-200 animate-blur-fade-up"
              style={{ animationDelay: item.delay }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right: FREE badge + Reserve seats pill (or Mobile Hamburger below lg) */}
        <div className="flex items-center gap-3">
          {/* Desktop Right Cluster */}
          <div
            className="hidden sm:flex items-center gap-3 animate-blur-fade-up"
            style={{ animationDelay: '350ms' }}
          >
            <span className="rounded-full bg-[#9b6bff] text-white text-[11px] font-medium tracking-[0.14em] px-3 py-1">
              FREE
            </span>

            <a
              href="#register"
              className="rounded-full accent-glass px-5 md:px-6 py-2 text-sm text-white inline-flex items-center gap-1.5 hover:text-white/90 transition-opacity"
            >
              <span>Register team</span>
              <ChevronRight className="w-4 h-4 text-white/70" />
            </a>
          </div>

          {/* Mobile Hamburger Button (below lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white focus:outline-none animate-blur-fade-up"
            style={{ animationDelay: '350ms' }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute transition-all duration-500 ease-out ${
                  mobileMenuOpen
                    ? 'opacity-100 rotate-0 scale-100'
                    : 'opacity-0 rotate-180 scale-50'
                }`}
              >
                <X className="w-5 h-5 text-white" />
              </span>
              <span
                className={`absolute transition-all duration-500 ease-out ${
                  !mobileMenuOpen
                    ? 'opacity-100 rotate-0 scale-100'
                    : 'opacity-0 -rotate-180 scale-50'
                }`}
              >
                <Menu className="w-5 h-5 text-white" />
              </span>
            </div>
          </button>
        </div>
      </header>

      {/* ======================================================================
          5. MOBILE MENU (below lg)
          ====================================================================== */}
      <div
        className={`lg:hidden fixed top-[72px] inset-x-4 sm:inset-x-6 z-40 rounded-2xl bg-[#080611]/95 backdrop-blur-lg border border-white/10 shadow-2xl p-4 transition-all duration-500 ease-out ${
          mobileMenuOpen
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((item, index) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="py-3 px-3 rounded-lg hover:bg-white/5 text-base font-medium text-white/80 hover:text-white transition-all duration-300"
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-8px)',
              }}
            >
              {item.label}
            </a>
          ))}

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between px-1">
            <span className="rounded-full bg-[#9b6bff] text-white text-[11px] font-medium tracking-[0.14em] px-3 py-1">
              FREE ADMISSION
            </span>
            <a
              href="#register"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full accent-glass px-4 py-1.5 text-xs text-white inline-flex items-center gap-1"
            >
              <span>Register team</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/70" />
            </a>
          </div>
        </div>
      </div>

      {/* ======================================================================
          6. HERO CONTENT (bottom of viewport, flex-1 flex flex-col justify-end)
          ====================================================================== */}
      <main className="relative z-10 flex-1 flex flex-col justify-end px-4 sm:px-6 md:px-12 pb-10 md:pb-16 pointer-events-auto">
        <div className="w-full">
          {/* Eyebrow */}
          <div
            className="font-mono text-[11px] tracking-[0.3em] uppercase text-white/50 mb-5 animate-blur-fade-up"
            style={{ animationDelay: '300ms' }}
          >
            FREE REGISTRATION · 24-HOUR SPRINT · BOOTCAMP CEC
          </div>

          {/* Metadata Row */}
          <div
            className="flex flex-wrap items-center gap-3 sm:gap-6 mb-6 md:mb-8 font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/55 animate-blur-fade-up"
            style={{ animationDelay: '380ms' }}
          >
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-[#9b6bff]" />
              <span>INNOVATION TRACKS</span>
            </div>
            <span className="text-white/20 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#9b6bff]" />
              <span>24-HOUR SPRINT</span>
            </div>
            <span className="text-white/20 hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <Ticket className="w-3.5 h-3.5 text-[#9b6bff]" />
              <span>ZERO ENTRY FEE</span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.94] tracking-[-0.01em] text-white mb-5 animate-blur-fade-up"
            style={{ animationDelay: '450ms' }}
          >
            <span className="block">Where ideas become</span>
            <span className="block accent-text italic">ventures.</span>
          </h1>

          {/* Sub-line */}
          <p
            className="text-base sm:text-lg md:text-xl text-white/60 max-w-xl mb-8 animate-blur-fade-up font-light leading-relaxed"
            style={{ animationDelay: '560ms' }}
          >
            Join thinkers and builders at College of Engineering Chengannur for a 24-hour sprint — free admission for all student innovators.
          </p>

          {/* CTA Row & Campus Node Hint */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Primary CTA: Register a team */}
              <a
                href="#register"
                className="bg-[#9b6bff] text-neutral-950 rounded-full font-medium px-6 sm:px-8 py-2.5 sm:py-3 text-sm inline-flex items-center gap-2 hover:bg-[#b18fff] transition-colors duration-200 animate-accent-pulse animate-blur-fade-up shadow-lg"
                style={{ animationDelay: '660ms' }}
              >
                <span>Register a team</span>
                <ArrowRight className="w-4 h-4 text-neutral-950" />
              </a>

              {/* Secondary CTA: Watch the trailer */}
              <button
                type="button"
                className="rounded-full font-medium liquid-glass px-6 sm:px-8 py-2.5 sm:py-3 text-sm text-white inline-flex items-center gap-2 hover:bg-white/[0.08] transition-colors duration-200 animate-blur-fade-up"
                style={{ animationDelay: '760ms' }}
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Watch the trailer</span>
              </button>
            </div>

            {/* Bottom Hint (Right-aligned on md+, under CTAs on mobile) */}
            <div
              className="font-mono text-[10px] tracking-[0.26em] uppercase text-white/40 flex items-center gap-2 animate-blur-fade-up"
              style={{ animationDelay: '860ms' }}
            >
              <MapPin className="w-3 h-3 text-[#9b6bff]" />
              <span>CEC CAMPUS · CHENGANNUR</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
