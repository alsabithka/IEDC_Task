import React from 'react'
import { Preloader } from './components/ui/Preloader'
import { Layout } from './components/layout/Layout'
import { MainContentPanel } from './components/sections/MainContentPanel'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * ============================================================================
 * IEDC IDEA SPRINT 2026 — OFFICIAL EVENT WEBSITE
 * ============================================================================
 * Temporarily restructured to exclusively render the approved hero page experience.
 * Subsequent sections (About, Objectives, Journey, Schedule, Matcher, Registration,
 * FAQ, Contact) are preserved in the codebase for future activation.
 * 
 * Hosted by IEDC BOOTCAMP CEC at College of Engineering Chengannur.
 */
export const App: React.FC = () => {
  return (
    <>
      {/* GSAP Cinematic Preloader (Preserved: IDEA SPRINT -> IEDC transformation) */}
      <Preloader onComplete={() => ScrollTrigger.refresh()} />

      {/* Main Website Flow: Hero Section Only */}
      <Layout>
        <MainContentPanel />
      </Layout>
    </>
  )
}

export default App
