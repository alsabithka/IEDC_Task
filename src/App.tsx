import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { Preloader } from './components/ui/Preloader'
import { ParticleBackgroundLayer } from './components/ui/ParticleBackgroundLayer'
import { Layout } from './components/layout/Layout'
import { MainContentPanel } from './components/sections/MainContentPanel'
import { ScheduleRoadmapSection } from './components/sections/ScheduleRoadmapSection'
import { RegistrationSection } from './components/sections/RegistrationSection'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const PRELOADER_STORAGE_KEY = 'iedc_preloader_completed'

/**
 * Checks if the preloader has already completed in the current browser session.
 */
function isPreloaderCompleted(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return sessionStorage.getItem(PRELOADER_STORAGE_KEY) === 'true'
  } catch {
    return false
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

  // Only trigger the preloader once per browser session on the first genuine website visit
  const [showPreloader, setShowPreloader] = useState<boolean>(() => !isPreloaderCompleted())
  const preloaderFinishedRef = useRef<boolean>(false)

  const handlePreloaderComplete = useCallback(() => {
    if (preloaderFinishedRef.current) return
    preloaderFinishedRef.current = true

    try {
      sessionStorage.setItem(PRELOADER_STORAGE_KEY, 'true')
    } catch {
      // Safely ignore storage quota / private browsing errors
    }

    setShowPreloader(false)
    ScrollTrigger.refresh()
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
        <Preloader onComplete={handlePreloaderComplete} />
      )}

      {/* Main Website Flow: Hero Section, Event Schedule & Train Game Promo, Registration */}
      <Layout>
        {/* 1. Hero Section (Strictly NO particle/grain texture applied) */}
        <MainContentPanel />

        {/* 2. Sub-Hero Website Sections with Shared Particle & Grain Texture Layer */}
        <div className="relative w-full bg-[#000000]">
          <ParticleBackgroundLayer />
          <ScheduleRoadmapSection onPlayGame={navigateToGame} />
          <RegistrationSection />
        </div>
      </Layout>
    </>
  )
}

export default App
