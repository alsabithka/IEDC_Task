import React from 'react'
import { Preloader } from './components/ui/Preloader'
import { ScrollLightBulb } from './components/ui/ScrollLightBulb'
import { Layout } from './components/layout/Layout'
import { MainContentPanel } from './components/sections/MainContentPanel'
import { AboutSection } from './components/sections/AboutSection'
import { ObjectivesSection } from './components/sections/ObjectivesSection'
import { WhyParticipateSection } from './components/sections/WhyParticipateSection'
import { JourneySection } from './components/sections/JourneySection'
import { ScheduleSection } from './components/sections/ScheduleSection'
import { TrackMatcherSection } from './components/sections/TrackMatcherSection'
import { RegistrationSection } from './components/sections/RegistrationSection'
import { FaqSection } from './components/sections/FaqSection'
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
      {/* GSAP Cinematic Preloader */}
      <Preloader onComplete={() => ScrollTrigger.refresh()} />

      {/* Fixed Interactive Scroll-Activated Light Bulb (Top-Right) */}
      <ScrollLightBulb />

      {/* Main Website Flow */}
      <Layout>
        {/* 1. Hero Section */}
        <MainContentPanel />

        {/* 2. About Idea Sprint Section */}
        <AboutSection />

        {/* 3. Program Objectives */}
        <ObjectivesSection />

        {/* 4. Why Participate & How It Works */}
        <WhyParticipateSection />

        {/* 5. The 24-Hour Journey */}
        <JourneySection />

        {/* 6. Day 1 and Day 2 Event Schedule */}
        <ScheduleSection />

        {/* 7. Interactive Feature: Sprint Track Matcher */}
        <TrackMatcherSection />

        {/* 8. Registration Form with Frontend Validation */}
        <RegistrationSection />

        {/* 9. FAQ Section */}
        <FaqSection />
      </Layout>
    </>
  )
}

export default App
