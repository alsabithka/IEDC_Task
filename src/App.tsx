import React from 'react'
import { Layout } from './components/layout/Layout'
import { Navbar } from './components/layout/Navbar'
import { HeroSection } from './components/sections/HeroSection'
import { AboutSection } from './components/sections/AboutSection'
import { ScheduleSection } from './components/sections/ScheduleSection'
import { Footer } from './components/layout/Footer'
import { Container, Badge, Button } from './components/ui'
import { EVENT_CONFIG } from './data/eventConfig'
import { ArrowRight, Sparkles, Terminal } from 'lucide-react'

export const App: React.FC = () => {
  return (
    <Layout>
      {/* A. Responsive Navigation Bar */}
      <Navbar />

      <main>
        {/* B. Hero Section with Live Countdown */}
        <HeroSection />

        {/* C. Event Introduction (24-Hour Ideathon, Pillars, Benefits) */}
        <AboutSection />

        {/* D. Event Schedule (Day 1 & Day 2 Interactive Tabs) */}
        <ScheduleSection />

        {/* Temporary Registration Gateway Anchor (Prepared for Phase 5) */}
        <section
          id="register"
          className="relative py-20 sm:py-28 bg-bg-secondary/60 hairline-t hairline-b overflow-hidden"
          aria-label="Registration Anchor"
        >
          <Container size="narrow" className="text-center">
            <Badge variant="primary" withDot size="sm" className="mb-4">
              REGISTRATION PORTAL GATEWAY
            </Badge>

            <h2 className="font-display text-heading-lg sm:text-display-lg font-bold text-text-primary">
              Ready to Sprint Your Idea into Reality?
            </h2>

            <p className="mt-4 text-body text-text-secondary max-w-xl mx-auto leading-relaxed">
              Registrations for student teams (1–4 members) across engineering, design, and business streams are being prepared. Join us at {EVENT_CONFIG.venue.campus}.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => {
                  const scheduleEl = document.getElementById('schedule')
                  if (scheduleEl) scheduleEl.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Review Schedule First
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<Terminal className="h-4 w-4 text-accent-primary" />}
                href={`mailto:${EVENT_CONFIG.contact.email}?subject=IEDC%20Idea%20Sprint%202026%20Inquiry`}
              >
                Direct Campus Inquiries
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 font-mono text-caption text-text-dim">
              <Sparkles className="h-3.5 w-3.5 text-accent-primary" />
              <span>Full Zod & React Hook Form integration arriving in subsequent phase</span>
            </div>
          </Container>
        </section>
      </main>

      {/* E. Comprehensive Footer */}
      <Footer />
    </Layout>
  )
}

export default App
