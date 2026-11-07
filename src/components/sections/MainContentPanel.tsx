import React, { useRef, useSyncExternalStore } from 'react'
import { siteConfig } from '../../config/siteConfig'
import { scrollToSheet } from '../../lib/scrollUtils'
import { useEventCountdown } from '../../hooks/useEventCountdown'
import { CountdownInstrumentScene } from '../ui/CountdownInstrumentScene'

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia('(max-width: 1023px)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getMobileSnapshot() {
  return window.matchMedia('(max-width: 1023px)').matches
}

function getMobileServerSnapshot() {
  return false
}

export const MainContentPanel: React.FC = () => {
  const countdown = useEventCountdown()
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot)
  const leftColRef = useRef<HTMLDivElement>(null)

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
      className="relative w-full min-h-[100dvh] flex flex-col justify-center bg-[#000000] text-white pt-16 sm:pt-20 lg:pt-[clamp(4.25rem,8vh,5.5rem)] pb-6 sm:pb-8 lg:pb-[clamp(1rem,2.5vh,2rem)] px-5 sm:px-8 lg:px-12 xl:px-16 overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
        {/* ==================================================================
            LEFT COLUMN: IDENTIFICATION LABEL, EDITORIAL STATEMENT, DESCRIPTION, CTA
            ================================================================== */}
        <div
          ref={leftColRef}
          className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-10"
        >
          {/* 1. Identification Label with white bar accent */}
          <div className="flex items-center gap-2.5 mb-2.5 sm:mb-3.5 lg:mb-[clamp(0.6rem,1.4vh,1.1rem)]">
            <span
              className="w-[3px] h-3.5 sm:h-4 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-[#D0D0D0]">
              IDEA SPRINT 2026
            </span>
          </div>

          {/* 2. Main Three-Line Editorial Statement */}
          <h1 className="font-display font-normal uppercase text-white tracking-[-0.01em] leading-[0.96] text-[clamp(2.75rem,10vw,4.2rem)] lg:text-[clamp(2.6rem,min(5vw,9.2vh),5.4rem)] text-left">
            <span className="block">IDEAS</span>
            <span className="block">BUILD</span>
            <span className="block">REALITY</span>
          </h1>

          {/* 3. Short Event Description */}
          <p className="mt-3 sm:mt-4 lg:mt-[clamp(0.6rem,1.8vh,1.25rem)] text-sm sm:text-base md:text-lg text-[#D0D0D0] font-sans font-medium leading-relaxed max-w-md sm:max-w-xl text-left">
            A 24-hour student ideathon by IEDC BOOTCAMP CEC.
          </p>

          {/* 4. Desktop Registration CTA Button */}
          <div className="mt-5 sm:mt-6 lg:mt-[clamp(1.2rem,2.8vh,2.25rem)] hidden lg:block">
            <a
              href={siteConfig.hero.ctaPrimary.href || '#register'}
              onClick={handleRegisterClick}
              className="min-w-[240px] sm:min-w-[260px] inline-flex items-center justify-center rounded-full bg-white text-black py-3.5 sm:py-4 px-8 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all duration-150 hover:bg-[#EAEAEA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center cursor-pointer"
            >
              REGISTER NOW
            </a>
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: PLAYFUL CARTOON 3D CALENDAR & STOPWATCH SCENE
            ================================================================== */}
        <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center w-full relative">
          <div className="w-full h-[380px] sm:h-[440px] lg:h-[clamp(340px,58vh,520px)] flex items-center justify-center relative">
            <CountdownInstrumentScene
              days={countdown.days}
              hours={countdown.hours}
              minutes={countdown.minutes}
              seconds={countdown.seconds}
              isMobile={isMobile}
              className="w-full h-full"
            />
          </div>

          {/* Mobile Registration CTA Button (Natural responsive flow beneath 3D scene) */}
          <div className="mt-4 w-full flex justify-center lg:hidden">
            <a
              href={siteConfig.hero.ctaPrimary.href || '#register'}
              onClick={handleRegisterClick}
              className="w-full max-w-[300px] inline-flex items-center justify-center rounded-full bg-white text-black py-3.5 sm:py-4 px-8 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all duration-150 hover:bg-[#EAEAEA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center cursor-pointer"
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
