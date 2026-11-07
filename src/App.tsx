import React from 'react'
import { Preloader } from './components/ui/Preloader'
import { Layout } from './components/layout/Layout'
import { MainContentPanel } from './components/sections/MainContentPanel'
import { ScheduleRoadmapSection } from './components/sections/ScheduleRoadmapSection'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * ============================================================================
 * IEDC IDEA SPRINT 2026 — OFFICIAL EVENT WEBSITE
 * ============================================================================
 * Hosted by IEDC BOOTCAMP CEC at College of Engineering Chengannur.
 */
export const App: React.FC = () => {
  return (
    <>
      {/* GSAP Cinematic Preloader (Preserved: IDEA SPRINT -> IEDC transformation) */}
      <Preloader onComplete={() => ScrollTrigger.refresh()} />

      {/* Main Website Flow: Hero Section & Event Schedule Roadmap Page */}
      <Layout>
        <MainContentPanel />
        <ScheduleRoadmapSection />
      </Layout>
    </>
  )
}

export default App
