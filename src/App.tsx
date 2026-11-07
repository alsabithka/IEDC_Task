import React, { useState, useEffect, Suspense } from 'react'
import { Preloader } from './components/ui/Preloader'
import { Layout } from './components/layout/Layout'
import { MainContentPanel } from './components/sections/MainContentPanel'
import { ScheduleRoadmapSection } from './components/sections/ScheduleRoadmapSection'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
        <TrainGamePage onReturnToWebsite={navigateToWebsite} />
      </Suspense>
    )
  }

  return (
    <>
      {/* GSAP Cinematic Preloader (Preserved: IDEA SPRINT -> IEDC transformation) */}
      <Preloader onComplete={() => ScrollTrigger.refresh()} />

      {/* Main Website Flow: Hero Section, Event Schedule & Train Game Invitation */}
      <Layout>
        <MainContentPanel />
        <ScheduleRoadmapSection onPlayGame={navigateToGame} />
      </Layout>
    </>
  )
}

export default App
