import React from 'react'
import { motion } from 'motion/react'
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  ChevronDown,
  Info,
} from 'lucide-react'
import { Button, Badge, Container } from '../ui'
import { EVENT_CONFIG } from '../../data/eventConfig'
import { useCountdown } from '../../hooks/useCountdown'

export const HeroSection: React.FC = () => {
  const countdown = useCountdown(EVENT_CONFIG.dates.targetCountdownISO)

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 pb-12 sm:pt-16 sm:pb-20 overflow-hidden"
      aria-label="Event Hero Section"
    >
      {/* Background Decorative Technical Accent Lines */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-tech-dense opacity-40"
        aria-hidden="true"
      />

      {/* Primary Ambient Spotlight Glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-accent-primary/6 blur-[150px]"
        aria-hidden="true"
      />

      <Container size="default" className="relative z-10 flex-1 flex flex-col justify-center">
        {/* Editorial Asymmetric Grid */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Editorial Headings & Call to Actions (7 cols) */}
          <div className="lg:col-span-7 text-left">
            {/* Kicker & Host Identifier */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="mb-4 flex flex-wrap items-center gap-2.5"
            >
              <Badge variant="tech" size="sm">
                HOSTED BY {EVENT_CONFIG.organizer.name}
              </Badge>
              <span className="text-border-default hidden sm:inline">•</span>
              <span className="font-mono text-[0.6875rem] font-medium text-text-secondary tracking-wide hidden sm:inline">
                {EVENT_CONFIG.organizer.institution}
              </span>
            </motion.div>

            {/* Giant Title Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <h1 className="font-display text-display-xl sm:text-display-2xl font-bold tracking-tight text-text-primary uppercase">
                {EVENT_CONFIG.eventName}{' '}
                <span className="text-gradient-primary">
                  {EVENT_CONFIG.edition}
                </span>
              </h1>
            </motion.div>

            {/* Compelling Value Proposition Headline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
              className="mt-4 font-display text-heading-md sm:text-heading-lg font-semibold text-text-primary leading-tight"
            >
              {EVENT_CONFIG.headline}
            </motion.p>

            {/* Concise Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              className="mt-4 max-w-xl text-body text-text-secondary leading-relaxed"
            >
              {EVENT_CONFIG.shortDescription}
            </motion.p>

            {/* Event Telemetry Metadata Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: 'easeOut' }}
              className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-caption font-mono text-text-secondary"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-primary" />
                <span>{EVENT_CONFIG.dates.eventDateRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-secondary" />
                <span>{EVENT_CONFIG.durationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-primary" />
                <span>{EVENT_CONFIG.venue.campus}</span>
              </div>
            </motion.div>

            {/* Primary & Secondary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button
                href="#register"
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Register Your Team
              </Button>
              <Button
                href="#schedule"
                variant="secondary"
                size="lg"
              >
                Explore 2-Day Schedule
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Live Countdown Terminal & Telemetry Card (5 cols) */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
              className="relative rounded-2xl border border-border-default bg-bg-secondary/90 p-6 sm:p-8 shadow-card-elevated backdrop-blur-md tech-bracket"
            >
              {/* Card Header Telemetry */}
              <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-primary opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-primary" />
                  </span>
                  <span className="font-mono text-caption font-semibold tracking-wider text-text-primary uppercase">
                    COUNTDOWN // SPRINT_TICKER
                  </span>
                </div>
                <Badge variant="tech" size="sm">
                  LIVE UTC+5:30
                </Badge>
              </div>

              {/* Countdown Digits Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* Days */}
                <div className="rounded-xl border border-border-subtle bg-bg-surface/80 p-3 sm:p-4">
                  <div className="font-mono text-heading-lg sm:text-display-lg font-bold tracking-tight text-text-primary">
                    {countdown.days}
                  </div>
                  <span className="mt-1 block font-mono text-[0.625rem] sm:text-caption tracking-widest text-text-dim uppercase">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="rounded-xl border border-border-subtle bg-bg-surface/80 p-3 sm:p-4">
                  <div className="font-mono text-heading-lg sm:text-display-lg font-bold tracking-tight text-text-primary">
                    {countdown.hours}
                  </div>
                  <span className="mt-1 block font-mono text-[0.625rem] sm:text-caption tracking-widest text-text-dim uppercase">
                    Hours
                  </span>
                </div>

                {/* Minutes */}
                <div className="rounded-xl border border-border-subtle bg-bg-surface/80 p-3 sm:p-4">
                  <div className="font-mono text-heading-lg sm:text-display-lg font-bold tracking-tight text-text-primary">
                    {countdown.minutes}
                  </div>
                  <span className="mt-1 block font-mono text-[0.625rem] sm:text-caption tracking-widest text-text-dim uppercase">
                    Minutes
                  </span>
                </div>

                {/* Seconds */}
                <div className="rounded-xl border border-border-accent/40 bg-accent-primary-subtle/30 p-3 sm:p-4">
                  <div className="font-mono text-heading-lg sm:text-display-lg font-bold tracking-tight text-accent-primary">
                    {countdown.seconds}
                  </div>
                  <span className="mt-1 block font-mono text-[0.625rem] sm:text-caption tracking-widest text-accent-primary uppercase">
                    Seconds
                  </span>
                </div>
              </div>

              {/* Configurable Placeholder Notice */}
              {!EVENT_CONFIG.dates.isDateConfirmed && (
                <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-border-subtle bg-bg-primary/60 p-3 text-left">
                  <Info className="h-4 w-4 shrink-0 text-accent-secondary mt-0.5" />
                  <p className="font-mono text-[0.6875rem] text-text-secondary leading-normal">
                    <span className="font-semibold text-text-primary">Placeholder Schedule: </span>
                    {EVENT_CONFIG.dates.placeholderNote}
                  </p>
                </div>
              )}

              {/* Fast Stats Row */}
              <div className="hairline-t mt-6 pt-4 grid grid-cols-2 gap-4 text-left">
                <div>
                  <span className="font-mono text-[0.6875rem] text-text-dim block uppercase">
                    Participation Model
                  </span>
                  <span className="font-sans text-body-sm font-semibold text-text-primary mt-0.5 block">
                    Teams of 1 – 4 Members
                  </span>
                </div>
                <div>
                  <span className="font-mono text-[0.6875rem] text-text-dim block uppercase">
                    Sprint Venue
                  </span>
                  <span className="font-sans text-body-sm font-semibold text-text-primary mt-0.5 block truncate">
                    {EVENT_CONFIG.venue.name}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* Subtle Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 flex flex-col items-center justify-center gap-1.5 text-center"
      >
        <a
          href="#about"
          className="group flex flex-col items-center gap-1 text-text-dim transition-colors hover:text-accent-primary focus-visible:outline-none"
          aria-label="Scroll to Event Overview"
        >
          <span className="font-mono text-[0.6875rem] tracking-widest uppercase">
            SCROLL TO EXPLORE
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-accent-primary" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}

export default HeroSection
