import React, { useState, useRef, useEffect } from 'react'
import { TrainGamePromo } from './TrainGamePromo'
import { Day1CinematicTrack } from './Day1CinematicTrack'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Clock,
  MapPin,
  Calendar,
  Flag,
  Navigation,
  Compass,
  Coffee,
  Users,
  Presentation,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export interface RoadmapMilestone {
  id: string
  stepNumber: string
  time: string
  title: string
  category: string
  description: string
  venue: string
  icon: React.ComponentType<{ className?: string }>
  progressPercent: string
}

export interface DaySchedule {
  dayId: 'day1' | 'day2'
  dayNumber: string
  dateLabel: string
  title: string
  subtitle: string
  milestones: RoadmapMilestone[]
}

const SCHEDULE_ROADMAP: DaySchedule[] = [
  {
    dayId: 'day1',
    dayNumber: 'DAY 01',
    dateLabel: 'Day 1 — Saturday',
    title: 'Inauguration & Collaboration',
    subtitle: 'From registration to interactive team sprint formation',
    milestones: [
      {
        id: 'd1-m1',
        stepNumber: '01',
        time: '09:00 AM',
        title: 'Registration & Inauguration',
        category: 'Check-In & Kickoff',
        description:
          'Participant arrival, badge verification, workstation allotment, and official inauguration ceremony.',
        venue: 'Main Auditorium / Foyer',
        icon: Navigation,
        progressPercent: '0%',
      },
      {
        id: 'd1-m2',
        stepNumber: '02',
        time: '10:00 AM',
        title: 'Main Session / Workshop',
        category: 'Keynote & Ideation',
        description:
          'Expert-led sprint workshop, domain problem statement disclosures, and solution framing methodologies.',
        venue: 'Seminar Hall 1',
        icon: Sparkles,
        progressPercent: '33%',
      },
      {
        id: 'd1-m3',
        stepNumber: '03',
        time: '01:00 PM',
        title: 'Lunch Break',
        category: 'Recharge & Rest',
        description:
          'Nutritional pause, informal conversations, and networking across diverse technical tracks.',
        venue: 'Dining Pavilion',
        icon: Coffee,
        progressPercent: '66%',
      },
      {
        id: 'd1-m4',
        stepNumber: '04',
        time: '02:00 PM',
        title: 'Team Activities & Networking',
        category: 'Synergy & Sprints',
        description:
          'Cross-team collaborative challenges, mentorship rounds, and dedicated team architecture sprints.',
        venue: 'Innovation Workspace',
        icon: Users,
        progressPercent: '100%',
      },
    ],
  },
  {
    dayId: 'day2',
    dayNumber: 'DAY 02',
    dateLabel: 'Day 2 — Sunday',
    title: 'Challenges & Closing Ceremony',
    subtitle: 'From intensive project work to final pitches and award reveals',
    milestones: [
      {
        id: 'd2-m1',
        stepNumber: '05',
        time: '09:00 AM',
        title: 'Welcome & Recap',
        category: 'Morning Assembly',
        description:
          'Day 2 opening assembly, progress recap, evaluation criteria review, and sprint timeline checkpoint.',
        venue: 'Main Auditorium',
        icon: Compass,
        progressPercent: '0%',
      },
      {
        id: 'd2-m2',
        stepNumber: '06',
        time: '10:00 AM',
        title: 'Challenges & Project Work',
        category: 'Deep Sprint Execution',
        description:
          'High-intensity building session, mentor critique integration, solution polishing, and pitch rehearsal.',
        venue: 'Project Labs & Workstations',
        icon: CheckCircle2,
        progressPercent: '33%',
      },
      {
        id: 'd2-m3',
        stepNumber: '07',
        time: '01:00 PM',
        title: 'Lunch Break',
        category: 'Recharge & Review',
        description:
          'Midday meal, final pitch deck checks, and audiovisual equipment calibration.',
        venue: 'Dining Pavilion',
        icon: Coffee,
        progressPercent: '66%',
      },
      {
        id: 'd2-m4',
        stepNumber: '08',
        time: '02:00 PM',
        title: 'Presentations & Closing Ceremony',
        category: 'Pitches & Valedictory',
        description:
          'Grand pitch presentations before the jury panel, winner announcements, felicitation, and closing remarks.',
        venue: 'Main Auditorium Stage',
        icon: Presentation,
        progressPercent: '100%',
      },
    ],
  },
]

interface ScheduleRoadmapSectionProps {
  onPlayGame?: () => void
}

export const ScheduleRoadmapSection: React.FC<ScheduleRoadmapSectionProps> = ({
  onPlayGame,
}) => {
  const [activeTab, setActiveTab] = useState<'day1' | 'day2'>('day1')
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right')

  const trackContainerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([])
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const finishNodeRef = useRef<HTMLDivElement>(null)

  const smoothScrollToScheduleTop = () => {
    const target = document.getElementById('schedule')
    if (!target) return

    const targetY = target.offsetTop
    const startY = window.scrollY
    const duration = 750
    const startTime = performance.now()

    const animateScroll = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      window.scrollTo(0, startY + (targetY - startY) * ease)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  const handleTabChange = (tab: 'day1' | 'day2') => {
    if (tab === activeTab) return
    setSlideDirection(tab === 'day2' ? 'right' : 'left')
    setActiveTab(tab)
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)
  }

  // GSAP ScrollTrigger: White progress line + Station highlight + Roadmap cards slowly unrevealing
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || activeTab === 'day1' || !trackContainerRef.current) return

    const ctx = gsap.context(() => {
      // Smooth toggle slide animation on container when switching days
      if (trackContainerRef.current) {
        gsap.fromTo(
          trackContainerRef.current,
          {
            opacity: 0,
            x: slideDirection === 'right' ? 32 : -32,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.38,
            ease: 'power3.out',
          }
        )
      }

      // 1. Left side white line showing scroll progress
      if (progressBarRef.current && trackContainerRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: trackContainerRef.current,
              start: 'top 75%',
              end: 'bottom 85%',
              scrub: 0.4,
            },
          }
        )
      }

      // 2. Each station node highlights & milestone card slowly unreveals as scroll reaches it
      milestoneRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return
        const nodeEl = nodeRefs.current[idx]

        // Faint initial state
        gsap.set(cardEl, { autoAlpha: 0.2, y: 16 })
        if (nodeEl) {
          gsap.set(nodeEl, {
            backgroundColor: '#121212',
            color: '#777777',
            borderColor: 'rgba(255, 255, 255, 0.25)',
          })
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 85%',
            end: 'top 55%',
            scrub: 0.4,
          },
        })

        // Slowly unreveal the card
        tl.to(cardEl, {
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
        })

        // Highlight current station on left line
        if (nodeEl) {
          tl.to(
            nodeEl,
            {
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#ffffff',
              boxShadow: '0 0 14px rgba(255, 255, 255, 0.7)',
              scale: 1.1,
              ease: 'power2.out',
            },
            0
          )
        }
      })

      // 3. Highlight finish node at destination
      if (finishNodeRef.current) {
        gsap.fromTo(
          finishNodeRef.current,
          { scale: 0.85, opacity: 0.4 },
          {
            scale: 1,
            opacity: 1,
            scrollTrigger: {
              trigger: finishNodeRef.current,
              start: 'top 90%',
              end: 'top 70%',
              scrub: 0.4,
            },
          }
        )
      }
    }, trackContainerRef)

    return () => ctx.revert()
  }, [activeTab, slideDirection])

  const visibleDays = SCHEDULE_ROADMAP.filter((day) => day.dayId === activeTab)

  return (
    <section
      id="schedule"
      className="relative z-10 w-full min-h-screen scroll-mt-16 sm:scroll-mt-20 bg-transparent text-white pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-[#1a1a1a] select-none"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto">
        {/* ==================================================================
            1. SECTION HEADER (High-Impact Editorial Header)
            ================================================================== */}
        <div className="mb-6 sm:mb-8">
          {/* Identification Label */}
          <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <span
              className="w-[3px] h-4 sm:h-5 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.24em] text-[#D0D0D0]">
              EVENT SCHEDULE
            </span>
          </div>

          {/* Main Headline */}
          <h2 className="font-display font-normal uppercase text-white tracking-[-0.015em] leading-[0.93] text-4xl sm:text-6xl lg:text-7xl">
            EVENT SCHEDULE
          </h2>
        </div>

        {/* ==================================================================
            2. PROMOTIONAL TRAIN GAME CALLOUT (GAME SESSION)
            "WHY SCROLL THROUGH THE SCHEDULE WHEN YOU CAN RIDE THROUGH IT?"
            ================================================================== */}
        <div className="mb-8 sm:mb-10">
          <TrainGamePromo
            onPlayGame={
              onPlayGame ||
              (() => {
                window.location.hash = '#/train-game'
              })
            }
          />
        </div>

        {/* ==================================================================
            3. DAY 1 / DAY 2 TAB SELECTOR (SMOOTH TOGGLE TRANSFER)
            ================================================================== */}
        <div id="day-tab-selector" className="w-full max-w-4xl mx-auto flex items-center justify-between mb-6 sm:mb-8 scroll-mt-24">
          <div className="relative inline-flex items-center p-1 rounded-full bg-[#0d0d0d] border border-[#222222] select-none">
            {/* Smooth Sliding Pill Thumb */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white shadow-md transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none ${
                activeTab === 'day1'
                  ? 'left-1 translate-x-0'
                  : 'left-1 translate-x-full'
              }`}
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => handleTabChange('day1')}
              className={`relative z-10 w-24 sm:w-28 py-2 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'day1'
                  ? 'text-black'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Day 1
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('day2')}
              className={`relative z-10 w-24 sm:w-28 py-2 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-center transition-colors duration-200 cursor-pointer ${
                activeTab === 'day2'
                  ? 'text-black'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Day 2
            </button>
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-[#777777] hidden sm:inline-block">
            {activeTab === 'day1' ? 'Day 1 — Saturday · 4 Stations' : 'Day 2 — Sunday · 4 Stations'}
          </span>
        </div>

        {/* ==================================================================
            4. ROADMAP TRACK (Focused Road Track for Selected Day)
            ================================================================== */}
        <div className="w-full max-w-4xl mx-auto">
          {visibleDays.map((daySchedule) =>
            daySchedule.dayId === 'day1' ? (
              <Day1CinematicTrack
                key="day1-cinematic"
                daySchedule={daySchedule}
                onGoToDay2={() => {
                  handleTabChange('day2')
                  smoothScrollToScheduleTop()
                }}
              />
            ) : (
              <div
                key={daySchedule.dayId}
                ref={trackContainerRef}
                className="relative flex flex-col rounded-3xl border border-[#202020] bg-[#070707] p-5 sm:p-8 lg:p-10 shadow-2xl transition-all duration-300 ease-out animate-in fade-in duration-300"
              >
              {/* Day Track Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-[#1f1f1f] mb-8 sm:mb-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white text-black font-mono font-black text-sm">
                    02
                  </span>
                  <div>
                    <h3 className="font-sans text-lg sm:text-xl font-black uppercase text-white tracking-tight">
                      {daySchedule.dayNumber} · {daySchedule.title}
                    </h3>
                    <p className="font-mono text-xs text-[#888888] mt-0.5">
                      {daySchedule.dateLabel}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/15 bg-white/5 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#D0D0D0]">
                  <Calendar className="h-3 w-3 text-white" />
                  <span>4 Stations</span>
                </div>
              </div>

              {/* Waypoint Start Node */}
              <div className="relative pl-12 sm:pl-16 mb-8">
                {/* Road Start Indicator */}
                <div className="absolute left-2 sm:left-4 top-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black shadow-lg z-10">
                  <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" />
                </div>

                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#888888]">
                  <span>ROUTE START</span>
                  <ArrowRight className="h-3 w-3 text-[#555555]" />
                  <span className="text-white font-bold">09:00 AM DEPLOYMENT</span>
                </div>
              </div>

              {/* Milestones Flow along the Road Track */}
              <div className="space-y-6 sm:space-y-8 relative">
                {/* Continuous Left Spine: Background dashed line + Dynamic White Progress Line */}
                <div
                  className="absolute left-[19px] sm:left-[29px] top-4 bottom-4 w-[2px] border-l-2 border-dashed border-white/20 pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  ref={progressBarRef}
                  className="absolute left-[19px] sm:left-[29px] top-4 bottom-4 w-[2px] bg-white pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  aria-hidden="true"
                />
                {daySchedule.milestones.map((milestone, mIdx) => {
                  const Icon = milestone.icon

                  return (
                    <div
                      key={milestone.id}
                      className="relative pl-12 sm:pl-16 group"
                    >
                      {/* Horizontal Connector Arm to Card */}
                      <div
                        className="absolute left-5 sm:left-7 top-6 w-5 sm:w-7 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors"
                        aria-hidden="true"
                      />

                      {/* Milestone Stop Node on the Road */}
                      <div
                        ref={(el) => {
                          nodeRefs.current[mIdx] = el
                        }}
                        className="absolute left-2 sm:left-4 top-3.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#121212] border-2 border-white text-white group-hover:bg-white group-hover:text-black transition-all duration-200 ring-4 ring-black shadow-md z-10"
                      >
                        <span className="font-mono text-[10px] sm:text-xs font-bold leading-none">
                          {milestone.stepNumber}
                        </span>
                      </div>

                      {/* Milestone Road Card */}
                      <div
                        ref={(el) => {
                          milestoneRefs.current[mIdx] = el
                        }}
                        className="rounded-2xl border border-[#222222] bg-[#0c0c0c] p-4 sm:p-6 transition-all duration-200 group-hover:border-white/40 group-hover:bg-[#121212] group-hover:translate-x-1 shadow-lg"
                      >
                        {/* Time & Category Badge Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 py-1 font-mono text-xs sm:text-sm font-bold text-white tracking-wide whitespace-nowrap">
                              <Clock className="h-3.5 w-3.5 text-white shrink-0" />
                              {milestone.time}
                            </span>
                            <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#D0D0D0] whitespace-nowrap">
                              {milestone.category}
                            </span>
                          </div>

                          <span className="font-mono text-[11px] text-[#666666] tracking-wider hidden sm:inline">
                            KM {mIdx * 3 + 1}.0
                          </span>
                        </div>

                        {/* Activity Title */}
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white/10 group-hover:border-white/30 transition-colors mt-0.5">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-sans text-base sm:text-lg font-bold text-white leading-snug">
                              {milestone.title}
                            </h4>
                            <p className="mt-1.5 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                              {milestone.description}
                            </p>
                          </div>
                        </div>

                        {/* Venue / Node Footer */}
                        <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#777777]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 text-[#A0A0A0] shrink-0" />
                            <span className="text-[#D0D0D0]">{milestone.venue}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-wider">
                            Progress: {milestone.progressPercent}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Waypoint Finish / Transition Marker */}
              <div className="relative pl-12 sm:pl-16 mt-8 pt-4 border-t border-[#191919]">
                <div
                  ref={finishNodeRef}
                  className="absolute left-2 sm:left-4 top-4 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black z-10 transition-transform"
                >
                  <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    SPRINT DESTINATION REACHED
                  </span>
                  <span className="font-mono text-[11px] text-[#777777]">
                    Valedictory & Awards
                  </span>
                </div>
              </div>
            </div>
          )
        )}
        </div>
      </div>
    </section>
  )
}

export default ScheduleRoadmapSection
