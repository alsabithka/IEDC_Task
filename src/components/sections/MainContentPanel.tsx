import React from 'react'
import {
  ArrowRight,
  Calendar,
  Users,
  Layers,
  Award,
} from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { useCountdown } from '../../hooks/useCountdown'

export const MainContentPanel: React.FC = () => {
  // Live ticking countdown to the event
  const countdown = useCountdown(siteConfig.hero.targetCountdownISO)

  return (
    <section id="home" className="relative w-full overflow-hidden bg-[#241C1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-14 sm:pb-20 relative w-full">
        {/* ====================================================================
            BACKGROUND AMBIENT ACCENTS (Subtle depth glows)
            ==================================================================== */}
        <div
          className="absolute -right-16 top-1/3 w-80 sm:w-96 lg:w-[480px] h-80 sm:h-96 lg:h-[480px] rounded-full bg-[#F0444D]/10 blur-3xl pointer-events-none select-none z-0"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-[#F0444D]/5 blur-2xl pointer-events-none select-none z-0"
          aria-hidden="true"
        />

        {/* ====================================================================
            HERO BODY: BALANCED TWO-COLUMN EDITORIAL LAYOUT
            ==================================================================== */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Main Typography, Eyebrow & CTAs (Columns 1-7) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Main Bold Uppercase Heading */}
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-[56px] font-black uppercase text-white tracking-tight leading-[1.05] drop-shadow-sm max-w-2xl">
              {siteConfig.hero.mainHeading}
            </h1>

            {/* Event Description */}
            <p className="mt-5 text-sm sm:text-base text-[#C5C0C0] leading-relaxed max-w-xl">
              {siteConfig.hero.description}
            </p>

            {/* CTAs: Register Now (Primary) & Explore the Sprint (Secondary) */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={siteConfig.hero.ctaPrimary.href}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F0444D] px-7 py-3.5 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[#F0444D]/25 transition-all duration-150 hover:bg-[#C92E39] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{siteConfig.hero.ctaPrimary.label}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={siteConfig.hero.ctaSecondary.href}
                className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full py-2 px-1"
                aria-label={siteConfig.hero.ctaSecondary.label}
              >
                <div className="h-11 w-11 rounded-full border border-white/35 flex items-center justify-center text-white transition-all duration-150 group-hover:border-white group-hover:bg-white/10 group-hover:scale-105 shrink-0">
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </div>
                <span className="font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C5C0C0] group-hover:text-white transition-colors">
                  {siteConfig.hero.ctaSecondary.label}
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Countdown & Sprint Parameters Card (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            {/* Live Countdown Card */}
            <div className="rounded-3xl border border-white/10 bg-[#1D1617] p-6 sm:p-7 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 text-xs font-mono uppercase tracking-wider text-[#C5C0C0]">
                <span className="flex items-center gap-2 text-white font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F0444D] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F0444D]" />
                  </span>
                  Live Event Countdown
                </span>
                <span className="text-[11px] text-[#F0444D] font-bold">EDITION 2026</span>
              </div>

              {/* 4-Column Timer Units */}
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="rounded-2xl border border-white/10 bg-[#241C1D] p-3 sm:p-3.5">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white block">
                    {countdown.days}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#C5C0C0] mt-0.5 block">
                    Days
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#241C1D] p-3 sm:p-3.5">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white block">
                    {countdown.hours}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#C5C0C0] mt-0.5 block">
                    Hours
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#241C1D] p-3 sm:p-3.5">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-white block">
                    {countdown.minutes}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#C5C0C0] mt-0.5 block">
                    Mins
                  </span>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#241C1D] p-3 sm:p-3.5">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#F0444D] block">
                    {countdown.seconds}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#C5C0C0] mt-0.5 block">
                    Secs
                  </span>
                </div>
              </div>

              {/* Schedule Status Notice */}
              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-start gap-2 text-xs font-mono text-[#8e8989] leading-relaxed">
                <Calendar className="h-3.5 w-3.5 text-[#F0444D] shrink-0 mt-0.5" />
                <span>{siteConfig.hero.dateNotice}</span>
              </div>
            </div>

            {/* Quick Metrics Row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl border border-white/10 bg-[#1D1617]/80 p-3 sm:p-3.5">
                <Users className="h-4 w-4 text-[#F0444D] mx-auto mb-1" />
                <span className="font-mono text-base sm:text-lg font-bold text-white block">
                  100+
                </span>
                <span className="text-[10px] font-mono uppercase text-[#C5C0C0]">
                  Students
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1D1617]/80 p-3 sm:p-3.5">
                <Layers className="h-4 w-4 text-[#F0444D] mx-auto mb-1" />
                <span className="font-mono text-base sm:text-lg font-bold text-white block">
                  07
                </span>
                <span className="text-[10px] font-mono uppercase text-[#C5C0C0]">
                  Domains
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#1D1617]/80 p-3 sm:p-3.5">
                <Award className="h-4 w-4 text-[#F0444D] mx-auto mb-1" />
                <span className="font-mono text-base sm:text-lg font-bold text-white block">
                  24h
                </span>
                <span className="text-[10px] font-mono uppercase text-[#C5C0C0]">
                  Sprint
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainContentPanel
