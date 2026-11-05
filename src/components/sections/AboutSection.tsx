import React from 'react'
import { motion } from 'motion/react'
import {
  Lightbulb,
  Users,
  Zap,
  Target,
  Trophy,
  Rocket,
  ShieldCheck,
} from 'lucide-react'
import { SectionHeading, Card, Badge, Container } from '../ui'
import { EVENT_CONFIG } from '../../data/eventConfig'

const pillarIcons = {
  Lightbulb: Lightbulb,
  Users: Users,
  Zap: Zap,
}

export const AboutSection: React.FC = () => {
  const { introduction } = EVENT_CONFIG

  const benefits = [
    {
      icon: Target,
      title: 'Real Industry Problem Sets',
      description:
        'Tackle real challenges curated with startup founders rather than abstract hypothetical exercises.',
    },
    {
      icon: ShieldCheck,
      title: 'Direct Mentorship Checkpoints',
      description:
        'Get 1-on-1 critique from serial entrepreneurs and senior engineers at designated sprint review gates.',
    },
    {
      icon: Trophy,
      title: 'Incubation & Grant Pathways',
      description:
        'Top validated ventures receive pre-seed guidance, incubation fast-tracking, and IEDC BOOTCAMP CEC ecosystem backing.',
    },
    {
      icon: Rocket,
      title: 'High-Density Learning Curve',
      description:
        'Experience the entire lifecycle of an early-stage startup—from ideation to business deck—in a single intense 24-hour cycle.',
    },
  ]

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 bg-bg-secondary/40 hairline-t hairline-b overflow-hidden"
      aria-label="About the Ideathon"
    >
      {/* Decorative Technical Coordinate Label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-6 left-8 hidden select-none font-mono text-[0.625rem] tracking-widest text-text-dim sm:block opacity-60"
      >
        // ARCHITECTURE // SPRINT_PURPOSE
      </div>

      <Container size="default">
        {/* Section Heading */}
        <SectionHeading
          index="01"
          badge={introduction.badge}
          title={introduction.title}
          description={introduction.lead}
          align="center"
        />

        {/* Sprint Telemetry Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6"
        >
          {introduction.sprintMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="relative rounded-xl border border-border-subtle bg-bg-surface/60 p-4 sm:p-6 text-center backdrop-blur-sm"
            >
              <div className="font-mono text-heading-xl sm:text-display-md font-bold text-accent-primary">
                {metric.value}
                {metric.unit && (
                  <span className="ml-1 text-caption text-text-dim font-normal">
                    {metric.unit}
                  </span>
                )}
              </div>
              <p className="mt-1 font-sans text-body-sm font-medium text-text-secondary">
                {metric.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* 3 Core Pillars: Ideas, Collaboration, Experimentation */}
        <div className="mb-20">
          <div className="mb-8 text-center sm:text-left">
            <span className="font-mono text-caption font-semibold tracking-wider text-accent-primary uppercase">
              // CORE PILLARS
            </span>
            <h3 className="font-display text-heading-md sm:text-heading-lg font-bold text-text-primary mt-1">
              Engineered Around Three Fundamental Forces
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {introduction.pillars.map((pillar) => {
              const IconComponent =
                pillarIcons[pillar.iconName as keyof typeof pillarIcons] || Lightbulb
              return (
                <Card
                  key={pillar.id}
                  variant="interactive"
                  withBracket
                  className="group flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border-default bg-bg-surface text-accent-primary transition-all duration-300 group-hover:border-accent-primary group-hover:bg-accent-primary-subtle">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-heading-sm font-bold text-border-default group-hover:text-accent-primary/60 transition-colors">
                        {pillar.number}
                      </span>
                    </div>

                    <h4 className="font-display text-heading-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                      {pillar.title}
                    </h4>

                    <p className="mt-3 text-body-sm text-text-secondary leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="hairline-t mt-6 pt-4">
                    <span className="font-mono text-[0.6875rem] text-text-dim uppercase tracking-wider">
                      CHECKPOINT INTEGRATION • GATE ACTIVE
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Why Participate Breakout Box */}
        <div id="why-participate" className="relative rounded-2xl border border-border-default bg-bg-secondary p-8 sm:p-12 tech-bracket">
          <div className="mb-8 max-w-2xl">
            <Badge variant="secondary" size="sm" className="mb-3">
              VALUE PROPOSITION
            </Badge>
            <h3 className="font-display text-heading-md sm:text-heading-xl font-bold text-text-primary">
              Why Step Up to the Sprint?
            </h3>
            <p className="mt-2 text-body text-text-secondary">
              Whether you are an aspiring software engineer, system architect, or creative strategist, Idea Sprint gives you a safe harbor to take massive creative risks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-bg-surface/50 p-5 transition-all duration-300 hover:border-border-accent hover:bg-bg-surface"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-bg-secondary text-accent-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-sans text-body font-semibold text-text-primary">
                    {benefit.title}
                  </h4>
                  <p className="mt-2 text-body-sm text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default AboutSection

