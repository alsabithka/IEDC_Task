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
import { HourglassCountdown } from '../ui/HourglassCountdown'
import { CosmicNebula } from '../ui/CosmicNebula'
import { EVENT_CONFIG } from '../../data/eventConfig'
import { useCountdown } from '../../hooks/useCountdown'

/**
 * HERO SECTION WITH FIXED HOURGLASS SAND COUNTDOWN
 * - Camera, position, scale and aspect ratio are permanently fixed.
 * - Upper and lower chambers display realistic warm champagne gold granular sand.
 * - Sand levels act as the real-time visual countdown source of truth.
 * - Cosmic nebula environment remains strictly outside the glass.
 */
export const HeroSection: React.FC = () => {
  const countdown = useCountdown(EVENT_CONFIG.dates.targetCountdownISO)

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-between pt-8 pb-12 sm:pt-16 sm:pb-20 overflow-hidden"
      aria-label="Event Hero Section"
    >
      {/* Deep Space Cosmic Nebula Atmosphere (Strictly Outside the Hourglass) */}
      <CosmicNebula />

      <Container size="default" className="relative z-10 flex-1 flex flex-col justify-center">
        {/* Asymmetrical Two-Column Hero Composition */}
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
              <Badge variant="primary" size="sm" withDot dotColor="emerald">
                HOURGLASS // IEDC BOOTCAMP CEC
              </Badge>
              <span className="text-border-default hidden sm:inline">•</span>
              <span className="font-mono text-[0.6875rem] font-medium text-text-secondary tracking-wide hidden sm:inline">
                {EVENT_CONFIG.organizer.institution}
              </span>
            </motion.div>

            {/* Giant Title with Fraunces Display Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            >
              <h1 className="font-fraunces text-display-xl sm:text-display-2xl font-bold tracking-tight text-text-primary">
                {EVENT_CONFIG.eventName}{' '}
                <span className="text-gradient-violet">
                  {EVENT_CONFIG.edition}
                </span>
              </h1>
            </motion.div>

            {/* Compelling Value Proposition Headline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: 'easeOut' }}
              className="mt-4 font-fraunces text-heading-md sm:text-heading-lg font-normal text-text-primary leading-tight italic"
            >
              "{EVENT_CONFIG.headline}"
            </motion.p>

            {/* Concise Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
              className="mt-4 max-w-xl font-inter text-body text-text-secondary leading-relaxed"
            >
              {EVENT_CONFIG.shortDescription}
            </motion.p>

            {/* Event Telemetry Metadata Row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: 'easeOut' }}
              className="mt-6 flex flex-wrap items-center gap-y-3 gap-x-6 text-caption font-ibm text-text-secondary"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-violet" />
                <span>{EVENT_CONFIG.dates.eventDateRange}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-sand-gold" />
                <span>{EVENT_CONFIG.durationLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-violet" />
                <span>{EVENT_CONFIG.venue.campus}</span>
              </div>
            </motion.div>

            {/* Action Buttons: Primary & Liquid Glass Button */}
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
                variant="glass"
                size="lg"
              >
                Explore 2-Day Schedule
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Signature Fixed Hourglass Sand Countdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* The Hourglass container uses pure opacity fade-in; NO scale/zoom/transform */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="relative flex flex-col items-center justify-center"
            >
              {/* Telemetry Status Chip Above Hourglass */}
              <div className="mb-3 flex items-center gap-2 rounded-full border border-border-default bg-bg-surface/80 px-3.5 py-1 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sand-gold opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sand-gold" />
                </span>
                <span className="font-ibm text-[0.6875rem] font-semibold tracking-wider text-text-primary uppercase">
                  HOURGLASS // CHRONO_STREAM
                </span>
              </div>

              {/* PERMANENT STATIONARY PHYSICAL HOURGLASS */}
              <div className="relative">
                <HourglassCountdown
                  countdown={countdown}
                  targetDateISO={EVENT_CONFIG.dates.targetCountdownISO}
                  width={290}
                  height={440}
                />
              </div>

              {/* Digital Telemetry Readout Below the Hourglass */}
              <div className="mt-4 w-full max-w-[320px] rounded-xl border border-border-subtle bg-bg-surface/80 p-3.5 backdrop-blur-md tech-bracket">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-lg bg-bg-primary/70 py-1.5 px-1 border border-border-subtle/60">
                    <span className="font-ibm text-heading-sm font-bold text-text-primary block">
                      {countdown.days}
                    </span>
                    <span className="font-ibm text-[0.5625rem] text-text-dim tracking-widest uppercase block">
                      Days
                    </span>
                  </div>
                  <div className="rounded-lg bg-bg-primary/70 py-1.5 px-1 border border-border-subtle/60">
                    <span className="font-ibm text-heading-sm font-bold text-text-primary block">
                      {countdown.hours}
                    </span>
                    <span className="font-ibm text-[0.5625rem] text-text-dim tracking-widest uppercase block">
                      Hours
                    </span>
                  </div>
                  <div className="rounded-lg bg-bg-primary/70 py-1.5 px-1 border border-border-subtle/60">
                    <span className="font-ibm text-heading-sm font-bold text-text-primary block">
                      {countdown.minutes}
                    </span>
                    <span className="font-ibm text-[0.5625rem] text-text-dim tracking-widest uppercase block">
                      Mins
                    </span>
                  </div>
                  <div className="rounded-lg bg-accent-violet-subtle py-1.5 px-1 border border-border-accent">
                    <span className="font-ibm text-heading-sm font-bold text-accent-violet block">
                      {countdown.seconds}
                    </span>
                    <span className="font-ibm text-[0.5625rem] text-accent-violet tracking-widest uppercase block">
                      Secs
                    </span>
                  </div>
                </div>

                {/* Configurable Placeholder Notice */}
                {!EVENT_CONFIG.dates.isDateConfirmed && (
                  <div className="mt-3 flex items-start gap-2 border-t border-border-subtle/60 pt-2.5 text-left">
                    <Info className="h-3.5 w-3.5 shrink-0 text-sand-gold mt-0.5" />
                    <p className="font-ibm text-[0.625rem] text-text-secondary leading-tight">
                      <span className="font-semibold text-text-primary">Tentative: </span>
                      {EVENT_CONFIG.dates.placeholderNote}
                    </p>
                  </div>
                )}
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
          className="group flex flex-col items-center gap-1 text-text-dim transition-colors hover:text-accent-violet focus-visible:outline-none"
          aria-label="Scroll to Event Overview"
        >
          <span className="font-ibm text-[0.625rem] tracking-widest uppercase">
            SCROLL TO EXPLORE SPRINT
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-accent-violet" />
          </motion.div>
        </a>
      </motion.div>
    </section>
  )
}

export default HeroSection
