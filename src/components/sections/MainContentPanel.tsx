import React, { useRef, useEffect, useSyncExternalStore, Suspense } from 'react'
import gsap from 'gsap'
import { siteConfig } from '../../config/siteConfig'
import { EVENT_CONFIG } from '../../data/eventConfig'
import { scrollToSheet } from '../../lib/scrollUtils'
import { useEventCountdown } from '../../hooks/useEventCountdown'
import { TextCountdownCounter } from '../ui/TextCountdownCounter'

// Lazy-load the heavy 3D Three.js stick field so it does not block initial paint
const FullPageStickField = React.lazy(() =>
  import('../ui/FullPageStickField').then(m => ({ default: m.FullPageStickField }))
)

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

// In-memory runtime flag for hero entrance animation.
// Cleared automatically on full browser reload (F5 / Ctrl + R).
// Preserves already-animated hero state across client-side navigation (e.g. returning from train game).
let hasHeroAnimatedInRuntime = false

export interface MainContentPanelProps {
  isHeroReady?: boolean
  isPreloaderActive?: boolean
}

export const MainContentPanel: React.FC<MainContentPanelProps> = ({
  isHeroReady = true,
  isPreloaderActive,
}) => {
  const countdown = useEventCountdown()
  const isMobile = useSyncExternalStore(subscribeMobile, getMobileSnapshot, getMobileServerSnapshot)
  const leftColRef = useRef<HTMLDivElement>(null)
  const contentGridRef = useRef<HTMLDivElement>(null)

  // Determine whether hero animation is cleared to start
  const shouldAnimate = isPreloaderActive !== undefined ? !isPreloaderActive : isHeroReady

  // Elegant intro entrance transition on load
  // Starts 1 second back from preloader finish so the main content loads smoothly as the preloader exits
  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = contentGridRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const targets = container.querySelectorAll('[data-hero-item]')
    if (!targets.length) return

    if (prefersReducedMotion || hasHeroAnimatedInRuntime) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: 'all' })
      return
    }

    // While preloader is running, keep hero elements in initial blank state
    if (!shouldAnimate) {
      gsap.set(targets, { opacity: 0, y: 22 })
      return
    }

    // Starts loading 1 second back from preloader finish
    hasHeroAnimatedInRuntime = true

    gsap.fromTo(
      targets,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform',
      }
    )
  }, [shouldAnimate])

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
      className="relative w-full min-h-screen flex flex-col justify-center bg-[#000000] text-white pt-16 sm:pt-20 lg:pt-20 xl:pt-24 pb-8 sm:pb-10 lg:pb-12 px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 overflow-hidden select-none"
    >
      {/* ── INTERACTIVE STICK EFFECT ON THE BACKSIDE OF THE WHOLE PAGE ── */}
      {isHeroReady && (
        <Suspense fallback={null}>
          <FullPageStickField isMobile={isMobile} />
        </Suspense>
      )}

      <div
        ref={contentGridRef}
        className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] gap-8 lg:gap-10 xl:gap-14 items-center relative z-10"
      >
        {/* ==================================================================
            LEFT COLUMN: IDENTIFICATION LABEL, EDITORIAL STATEMENT, DESCRIPTION, CTA (45%)
            ================================================================== */}
        <div
          ref={leftColRef}
          className="flex flex-col items-start text-left z-10 w-full"
        >
          {/* 1. Identification Label with white bar accent */}
          <div data-hero-item className="flex items-center gap-2.5 mb-3 sm:mb-4 lg:mb-5">
            <span
              className="w-[3px] h-4 sm:h-5 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.24em] text-[#D0D0D0]">
              IDEA SPRINT 2026
            </span>
          </div>

          {/* 2. Main Three-Line Editorial Statement (Large, Bold, High-Impact) */}
          <h1 data-hero-item className="font-display font-normal uppercase text-white tracking-[-0.015em] leading-[0.93] text-[clamp(3.2rem,8.5vw,4.8rem)] lg:text-[clamp(4.2rem,5.8vw+0.4rem,8.2rem)] text-left">
            <span className="block">IDEAS</span>
            <span className="block">BUILD</span>
            <span className="block">REALITY</span>
          </h1>

          {/* 3. Short Event Description */}
          <p data-hero-item className="mt-4 sm:mt-5 lg:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-[#D0D0D0] font-sans font-medium leading-relaxed max-w-md sm:max-w-xl text-left">
            A 24-hour student ideathon by IEDC BOOTCAMP CEC.
          </p>

          {/* 4. Desktop Registration CTA Button */}
          <div data-hero-item className="mt-6 sm:mt-8 lg:mt-9 hidden lg:block">
            <a
              href={siteConfig.hero.ctaPrimary.href || '#register'}
              onClick={handleRegisterClick}
              className="min-w-[240px] sm:min-w-[270px] inline-flex items-center justify-center rounded-full bg-white text-black py-4 px-9 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-xl transition-all duration-150 hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center cursor-pointer"
            >
              REGISTER NOW
            </a>
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: TEXT-DRIVEN COUNTDOWN COUNTER WITH DATE (55%)
            ================================================================== */}
        <div data-hero-item className="flex flex-col items-center lg:items-end justify-center w-full relative">
          <TextCountdownCounter
            days={countdown.days}
            hours={countdown.hours}
            minutes={countdown.minutes}
            seconds={countdown.seconds}
            dateRange={EVENT_CONFIG.dates.eventDateRange}
          />

          {/* Mobile Registration CTA Button (Natural responsive flow beneath counter) */}
          <div className="mt-6 sm:mt-8 w-full flex justify-center lg:hidden">
            <a
              href={siteConfig.hero.ctaPrimary.href || '#register'}
              onClick={handleRegisterClick}
              className="w-full max-w-[320px] inline-flex items-center justify-center rounded-full bg-white text-black py-4 px-8 font-sans text-sm sm:text-base font-black uppercase tracking-wider shadow-lg transition-all duration-150 hover:bg-[#EAEAEA] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white text-center cursor-pointer"
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
