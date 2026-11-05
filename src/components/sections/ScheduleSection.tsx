import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Clock,
  MapPin,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import { SectionHeading, Container } from '../ui'
import { EVENT_CONFIG } from '../../data/eventConfig'
import type { ScheduleCategory } from '../../types/event'
import { cn } from '../../lib/utils'

const categoryStyles: Record<
  ScheduleCategory,
  { label: string; bg: string; text: string; border: string }
> = {
  'Check-in': {
    label: 'Check-in',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  Keynote: {
    label: 'Keynote',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  Sprint: {
    label: 'Sprint Active',
    bg: 'bg-accent-primary-subtle',
    text: 'text-accent-primary',
    border: 'border-border-accent',
  },
  Mentoring: {
    label: 'Mentoring Gate',
    bg: 'bg-accent-secondary-subtle',
    text: 'text-accent-secondary',
    border: 'border-border-accent-secondary',
  },
  Review: {
    label: 'Review Gate',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  Pitch: {
    label: 'Jury Pitching',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  Ceremony: {
    label: 'Ceremony',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  Break: {
    label: 'Recharge / Meal',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/30',
  },
}

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1)
  const { schedule } = EVENT_CONFIG

  const currentDayData = activeDay === 1 ? schedule.day1 : schedule.day2

  return (
    <section
      id="schedule"
      className="relative py-24 sm:py-32 overflow-hidden bg-bg-primary"
      aria-label="Event Schedule"
    >
      <Container size="default">
        {/* Section Heading */}
        <SectionHeading
          index="02"
          badge="EVENT TIMELINE"
          title="Two Days of Relentless"
          highlight="Ideation & Execution"
          description="Chronologically structured to take student teams from undefined concepts to defensible venture prototypes within 24 intense hours."
          align="center"
        />

        {/* Sample Schedule Notice */}
        {schedule.isSampleSchedule && (
          <div className="mx-auto mb-10 flex max-w-2xl items-center justify-center gap-2.5 rounded-full border border-border-default bg-bg-surface/70 px-4 py-2 text-center text-caption font-mono text-text-secondary backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 shrink-0 text-accent-secondary" />
            <span>
              Configurable Sample Timeline. Official schedule confirmed prior to sprint kickoff.
            </span>
          </div>
        )}

        {/* Day 1 / Day 2 Animated Switcher Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl border border-border-default bg-bg-secondary p-1.5 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setActiveDay(1)}
              className={cn(
                'relative flex items-center gap-2.5 rounded-lg px-6 py-2.5 font-sans text-body-sm font-semibold transition-colors duration-200 focus-visible:outline-none',
                activeDay === 1
                  ? 'text-text-inverse'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {activeDay === 1 && (
                <motion.div
                  layoutId="active-schedule-tab"
                  className="absolute inset-0 rounded-lg bg-accent-primary shadow-glow-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-mono text-caption">01</span>
              <span className="relative z-10">Day 01 — Sprint Ignition</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDay(2)}
              className={cn(
                'relative flex items-center gap-2.5 rounded-lg px-6 py-2.5 font-sans text-body-sm font-semibold transition-colors duration-200 focus-visible:outline-none',
                activeDay === 2
                  ? 'text-text-inverse'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {activeDay === 2 && (
                <motion.div
                  layoutId="active-schedule-tab"
                  className="absolute inset-0 rounded-lg bg-accent-primary shadow-glow-primary"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10 font-mono text-caption">02</span>
              <span className="relative z-10">Day 02 — Pitch & Finale</span>
            </button>
          </div>
        </div>

        {/* Day Header Info */}
        <div className="mb-8 rounded-xl border border-border-subtle bg-bg-surface/40 p-4 sm:p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-mono text-caption font-bold text-accent-primary uppercase tracking-widest">
              [DAY // 0{activeDay}]
            </span>
            <h3 className="font-display text-heading-sm sm:text-heading-md font-bold text-text-primary mt-0.5">
              {currentDayData.dayTitle}
            </h3>
            <p className="text-body-sm text-text-secondary mt-1">
              Focus: {currentDayData.theme}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-caption text-text-dim">
            <Calendar className="h-4 w-4 text-accent-primary" />
            <span>{currentDayData.dateLabel}</span>
          </div>
        </div>

        {/* Timeline Activities List */}
        <div className="relative mx-auto max-w-4xl">
          {/* Central Vertical Connector Line */}
          <div
            className="absolute top-4 bottom-4 left-4 sm:left-32 w-px bg-border-default"
            aria-hidden="true"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentDayData.items.map((item) => {
                const categoryConfig = categoryStyles[item.category]

                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-8 pl-10 sm:pl-0"
                  >
                    {/* Timestamp Node */}
                    <div className="sm:w-32 shrink-0 sm:text-right">
                      <span className="inline-flex items-center gap-1.5 font-mono text-caption font-bold text-text-primary bg-bg-surface px-2.5 py-1 rounded border border-border-subtle">
                        <Clock className="h-3 w-3 text-accent-primary" />
                        {item.time}
                      </span>
                    </div>

                    {/* Timeline Dot Indicator */}
                    <div
                      className={cn(
                        'absolute left-2.5 sm:left-[7.9rem] top-2 h-3.5 w-3.5 rounded-full border-2 border-bg-primary bg-border-default transition-colors',
                        item.category === 'Sprint' && 'bg-accent-primary ring-4 ring-accent-primary/20',
                        item.category === 'Mentoring' && 'bg-accent-secondary ring-4 ring-accent-secondary/20',
                        item.category === 'Pitch' && 'bg-rose-500 ring-4 ring-rose-500/20',
                      )}
                      aria-hidden="true"
                    />

                    {/* Activity Card */}
                    <div className="flex-1 w-full rounded-xl border border-border-subtle bg-bg-secondary/70 p-5 sm:p-6 transition-all duration-200 hover:border-border-default hover:bg-bg-surface/80">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium border',
                            categoryConfig.bg,
                            categoryConfig.text,
                            categoryConfig.border,
                          )}
                        >
                          {categoryConfig.label}
                        </span>

                        {item.venue && (
                          <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-text-dim">
                            <MapPin className="h-3 w-3 text-accent-primary" />
                            {item.venue}
                          </span>
                        )}
                      </div>

                      <h4 className="font-display text-body-lg font-bold text-text-primary">
                        {item.title}
                      </h4>

                      <p className="mt-1.5 text-body-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>

                      {item.speakerOrMentor && (
                        <div className="mt-4 flex items-center gap-2 border-t border-border-subtle/60 pt-3 text-caption font-mono text-text-dim">
                          <User className="h-3.5 w-3.5 text-accent-secondary" />
                          <span>Led by: {item.speakerOrMentor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}

export default ScheduleSection
