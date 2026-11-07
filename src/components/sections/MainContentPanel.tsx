import React from 'react'
import { siteConfig } from '../../config/siteConfig'
import { useCountdown } from '../../hooks/useCountdown'
import { scrollToSheet } from '../../lib/scrollUtils'
import { DaysRemainingCalendar } from '../ui/DaysRemainingCalendar'
import { StopwatchCountdown } from '../ui/StopwatchCountdown'

export const MainContentPanel: React.FC = () => {
  // Live ticking countdown to authoritative timestamp in src/data/eventConfig.ts
  const countdown = useCountdown()

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector(siteConfig.hero.ctaPrimary.href || '#register')
    if (target) {
      e.preventDefault()
      scrollToSheet(siteConfig.hero.ctaPrimary.href || '#register')
    }
  }

  return (
    <section
      id="home"
      className="relative w-full min-h-[100dvh] flex flex-col justify-center bg-[#000000] text-white pt-20 sm:pt-24 lg:pt-28 pb-14 sm:pb-20 px-6 sm:px-10 lg:px-16 overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* ==================================================================
            LEFT COLUMN: IDENTIFICATION LABEL, HEADING, DESCRIPTION, DESKTOP CTA
            ================================================================== */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-start text-left">
          {/* 1. Hero Identification Label */}
          <div className="flex items-center gap-2.5 mb-3.5 sm:mb-5">
            <span
              className="w-[3px] h-3.5 sm:h-4 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#D0D0D0]">
              IDEA SPRINT 2026
            </span>
          </div>

          {/* 2. Main Three-Line Editorial Statement */}
          <h1 className="font-display font-black uppercase text-white tracking-tight leading-[0.84] text-[clamp(3.8rem,11.5vw,7.6rem)] text-left">
            <span className="block">IDEAS</span>
            <span className="block">BUILD</span>
            <span className="block">REALITY</span>
          </h1>

          {/* 3. Description */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#D0D0D0] font-sans font-medium leading-relaxed max-w-md sm:max-w-xl text-left">
            A 24-hour student ideathon by IEDC BOOTCAMP CEC.
          </p>

          {/* 4. Desktop Registration CTA Button */}
          <div className="mt-8 sm:mt-10 hidden lg:block">
            <a
              href={siteConfig.hero.ctaPrimary.href || '#register'}
              onClick={handleRegisterClick}
              className="min-w-[260px] inline-flex items-center justify-center rounded-full bg-white text-black py-4 px-8 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all duration-150 hover:bg-[#EAEAEA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center cursor-pointer"
            >
              REGISTER NOW
            </a>
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: TECHNICAL CALENDAR & STOPWATCH INSTRUMENT SYSTEM
            Architectural blueprint aesthetic with precision line composition
            ================================================================== */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center lg:items-end justify-center w-full mt-4 lg:mt-0">
          <div className="w-full max-w-[380px] flex flex-col items-center">
            {/* Component 1: Technical Days Remaining Calendar */}
            <DaysRemainingCalendar
              days={countdown.days}
              isComplete={countdown.isComplete}
              className="w-full"
            />

            {/* Subtle Blueprint Connection Line linking Calendar & Stopwatch */}
            <div
              className="w-full max-w-[340px] flex items-center justify-center my-3 relative"
              aria-hidden="true"
            >
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-[#000000] px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="font-mono text-[8px] tracking-widest text-[#777777] uppercase">
                  LINK_SYS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
            </div>

            {/* Component 2: Precision Stopwatch Countdown (HH : MM : SS) */}
            <StopwatchCountdown
              hours={countdown.hours}
              minutes={countdown.minutes}
              seconds={countdown.seconds}
              isComplete={countdown.isComplete}
              className="w-full"
            />

            {/* Small Technical Micro-Labels under the composition */}
            <div className="w-full flex items-center justify-between px-2 pt-3 text-[9px] font-mono tracking-widest text-[#777777] uppercase select-none">
              <span>IEDC BOOTCAMP CEC</span>
              <span>MEASUREMENT // SYS-01</span>
            </div>
          </div>

          {/* Mobile Registration CTA Button (Positioned naturally after instruments) */}
          <div className="mt-8 w-full flex justify-center lg:hidden">
            <a
              href={siteConfig.hero.ctaPrimary.href || '#register'}
              onClick={handleRegisterClick}
              className="w-full max-w-[300px] inline-flex items-center justify-center rounded-full bg-white text-black py-4 px-8 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all duration-150 hover:bg-[#EAEAEA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center cursor-pointer"
            >
              REGISTER NOW
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainContentPanel
