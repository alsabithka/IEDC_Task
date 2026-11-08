import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { Preloader } from './components/ui/Preloader'
import { ParticleBackgroundLayer } from './components/ui/ParticleBackgroundLayer'
import { Layout } from './components/layout/Layout'
import { MainContentPanel } from './components/sections/MainContentPanel'
import { ScheduleRoadmapSection } from './components/sections/ScheduleRoadmapSection'
import { RegistrationSection } from './components/sections/RegistrationSection'
import { Footer } from './components/layout/Footer'
import { SmoothScrollProvider } from './providers/SmoothScrollProvider'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// In-memory runtime tracking for preloader completion across client-side route navigation.
// Resets naturally on every full browser reload (F5 / Ctrl + R) so the preloader always shows.
let hasPreloaderCompletedInRuntime = false

// Clean up any legacy sessionStorage keys so they never suppress reload animations
if (typeof window !== 'undefined') {
  try {
    sessionStorage.removeItem('iedc_preloader_completed')
  } catch {
    // Ignore security/quota restrictions
  }
}

// Lazy-load the heavy 3D Train Driving Game only when requested
const TrainGamePage = React.lazy(() => import('./pages/TrainGamePage'))

function checkIsGameRoute(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.location.pathname.startsWith('/train-game') ||
    window.location.hash.startsWith('#/train-game')
  )
}

/**
 * ============================================================================
 * IEDC IDEA SPRINT 2026 — OFFICIAL EVENT WEBSITE
 * ============================================================================
 * Hosted by IEDC BOOTCAMP CEC at College of Engineering Chengannur.
 */
export const App: React.FC = () => {
  const [isGameRoute, setIsGameRoute] = useState<boolean>(checkIsGameRoute)

  // Shows preloader on every full browser reload, but suppresses on client-side route navigation
  const [showPreloader, setShowPreloader] = useState<boolean>(
    () => !hasPreloaderCompletedInRuntime
  )
  const [isHeroReady, setIsHeroReady] = useState<boolean>(
    () => hasPreloaderCompletedInRuntime
  )
  const preloaderFinishedRef = useRef<boolean>(false)

  const handlePreloaderStartExit = useCallback(() => {
    setIsHeroReady(true)
  }, [])

  const handlePreloaderComplete = useCallback(() => {
    if (preloaderFinishedRef.current) return
    preloaderFinishedRef.current = true
    hasPreloaderCompletedInRuntime = true

    setIsHeroReady(true)
    setShowPreloader(false)
    ScrollTrigger.refresh()
  }, [])

  useEffect(() => {
    // Ensure scroll position resets to top on full page reload
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    const handleLocationChange = () => {
      setIsGameRoute(checkIsGameRoute())
    }

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [])

  const navigateToGame = () => {
    window.location.hash = '#/train-game'
    setIsGameRoute(true)
  }

  const navigateToWebsite = () => {
    if (window.location.hash.startsWith('#/train-game')) {
      window.location.hash = '#schedule'
    } else {
      window.history.pushState({}, '', '/')
    }
    setIsGameRoute(false)
  }

  const navigateToRegister = () => {
    if (window.location.pathname.startsWith('/train-game')) {
      window.history.pushState({}, '', '/')
    } else {
      window.location.hash = '#register'
    }
    setIsGameRoute(false)
    setTimeout(() => {
      const regEl = document.getElementById('register')
      if (regEl) {
        regEl.scrollIntoView({ behavior: 'smooth' })
      }
    }, 150)
  }

  // If in Train Game Mode, render isolated 3D simulation with lightweight loading fallback
  if (isGameRoute) {
    return (
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-[#070707] text-white flex flex-col items-center justify-center font-mono select-none">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black font-black text-sm mb-4 animate-pulse">
              CEC
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">
              LOADING IDEA SPRINT EXPRESS...
            </p>
            <span className="mt-2 text-xs text-[#777777]">
              Initializing First-Person Driver Cockpit & Track
            </span>
          </div>
        }
      >
        <TrainGamePage
          onReturnToWebsite={navigateToWebsite}
          onRegister={navigateToRegister}
        />
      </Suspense>
    )
  }

  return (
    <>
      {/* GSAP Cinematic Preloader (Runs once per session on the first genuine website visit) */}
      {showPreloader && (
        <Preloader
          onStartExit={handlePreloaderStartExit}
          onComplete={handlePreloaderComplete}
        />
      )}

      {/* Main Website Flow: Hero Section, Event Schedule & Train Game Promo, Registration */}
      <SmoothScrollProvider isPaused={showPreloader}>
        <Layout>
          {/* 1. Hero Section (Strictly NO particle/grain texture applied) */}
          <MainContentPanel isHeroReady={isHeroReady} />

          {/* 2. Sub-Hero Website Sections with Shared Particle & Grain Texture Layer */}
          <div className="relative w-full bg-[#000000]">
            <ParticleBackgroundLayer />
            <ScheduleRoadmapSection onPlayGame={navigateToGame} />
            <RegistrationSection />
            <Footer onNavigateToGame={navigateToGame} />
          </div>
        </Layout>
      </SmoothScrollProvider>
    </>
  )
}

export default App
