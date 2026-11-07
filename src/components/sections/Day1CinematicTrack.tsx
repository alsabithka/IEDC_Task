import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Clock,
  MapPin,
  Calendar,
  Flag,
  Navigation,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import type { DaySchedule } from './ScheduleRoadmapSection'

gsap.registerPlugin(ScrollTrigger)

interface Day1CinematicTrackProps {
  daySchedule: DaySchedule
  onGoToDay2: () => void
}

/**
 * DAY 1 EVENT SCHEDULE — CINEMATIC GSAP SCROLL EXPERIENCE
 * 
 * Progressive unfolding scroll experience:
 * - Pure black-and-white editorial aesthetic (No aeroplanes, no vehicles, no decorative journey graphics)
 * - Fine SVG vector timeline line drawing progressively from top to bottom
 * - Station destination markers illuminating as the line reaches each station
 * - Session cards revealing with subtle opacity, translateY, border flash, and staggered text
 * - Completion flag pops with spring bounce, completion badge reveals
 * - GO TO DAY 2 button appears ONLY AFTER the entire journey is completed
 * - Supports smooth reverse scrolling and prefers-reduced-motion fallback
 */
export const Day1CinematicTrack: React.FC<Day1CinematicTrackProps> = ({
  daySchedule,
  onGoToDay2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerTrackRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const startNodeRef = useRef<HTMLDivElement>(null)
  const lineTrackRef = useRef<HTMLDivElement>(null)

  // SVG drawing line ref
  const svgLineRef = useRef<SVGLineElement>(null)

  // Destination nodes & session cards
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardBadgeRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardTitleRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardDescRefs = useRef<(HTMLDivElement | null)[]>([])
  const cardFooterRefs = useRef<(HTMLDivElement | null)[]>([])

  // Completion section
  const finishNodeRef = useRef<HTMLDivElement>(null)
  const finishFlagRef = useRef<HTMLDivElement>(null)
  const completionBadgeRef = useRef<HTMLDivElement>(null)
  const day2BtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // If reduced motion is requested, immediately present all content statically
    if (prefersReducedMotion) {
      if (cardRefs.current) {
        gsap.set(cardRefs.current.filter(Boolean), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        })
      }
      if (nodeRefs.current) {
        gsap.set(nodeRefs.current.filter(Boolean), {
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#ffffff',
          scale: 1,
        })
      }
      if (finishFlagRef.current) {
        gsap.set(finishFlagRef.current, { scale: 1, autoAlpha: 1 })
      }
      if (completionBadgeRef.current) {
        gsap.set(completionBadgeRef.current, { autoAlpha: 1, y: 0 })
      }
      if (day2BtnRef.current) {
        gsap.set(day2BtnRef.current, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
        })
      }
      if (svgLineRef.current) {
        gsap.set(svgLineRef.current, { strokeDashoffset: 0 })
      }
      return
    }

    const ctx = gsap.context(() => {
      if (
        !containerRef.current ||
        !innerTrackRef.current ||
        !startNodeRef.current ||
        !finishNodeRef.current ||
        !svgLineRef.current
      ) {
        return
      }

      // Calculate track height for the SVG hairline drawing
      const trackHeight = lineTrackRef.current?.clientHeight || 850
      svgLineRef.current.setAttribute('y2', String(trackHeight))
      gsap.set(svgLineRef.current, {
        strokeDasharray: trackHeight,
        strokeDashoffset: trackHeight,
      })

      // 1. Initial State: All cards hidden with subtle elevation & scale
      gsap.set(cardRefs.current.filter(Boolean), {
        autoAlpha: 0.12,
        y: 20,
        scale: 0.98,
        borderColor: '#202020',
      })

      // Card internal staggered elements initially muted
      gsap.set(cardBadgeRefs.current.filter(Boolean), { autoAlpha: 0.2, y: 6 })
      gsap.set(cardTitleRefs.current.filter(Boolean), { autoAlpha: 0.2, y: 6 })
      gsap.set(cardDescRefs.current.filter(Boolean), { autoAlpha: 0.2, y: 6 })
      gsap.set(cardFooterRefs.current.filter(Boolean), { autoAlpha: 0.2, y: 6 })

      // Destination markers start in subtle inactive dark state
      gsap.set(nodeRefs.current.filter(Boolean), {
        backgroundColor: '#0c0c0c',
        color: '#666666',
        borderColor: 'rgba(255, 255, 255, 0.22)',
        scale: 1,
      })

      // Completion elements
      if (finishFlagRef.current) {
        gsap.set(finishFlagRef.current, { scale: 0, autoAlpha: 0 })
      }
      if (completionBadgeRef.current) {
        gsap.set(completionBadgeRef.current, { autoAlpha: 0, y: 10 })
      }
      if (day2BtnRef.current) {
        gsap.set(day2BtnRef.current, {
          autoAlpha: 0,
          y: 18,
          scale: 0.95,
          pointerEvents: 'none',
        })
      }

      // 1. Outer Container Smooth Entrance
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0.7, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      )

      // 2. Scroll-Driven Timeline Drawing (Fine glowing white hairline)
      gsap.to(svgLineRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: innerTrackRef.current,
          start: 'top 75%',
          end: 'bottom 80%',
          scrub: 0.4,
          onRefresh: (self) => {
            const h = lineTrackRef.current?.clientHeight || 850
            if (svgLineRef.current) {
              svgLineRef.current.setAttribute('y2', String(h))
              gsap.set(svgLineRef.current, {
                strokeDasharray: h,
                strokeDashoffset: (1 - self.progress) * h,
              })
            }
          },
        },
      })

      // 3. Station Destinations Sequence: Each marker activates & card reveals
      cardRefs.current.forEach((card, idx) => {
        if (!card) return
        const node = nodeRefs.current[idx]
        const badge = cardBadgeRefs.current[idx]
        const title = cardTitleRefs.current[idx]
        const desc = cardDescRefs.current[idx]
        const footer = cardFooterRefs.current[idx]

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            end: 'top 52%',
            scrub: 0.4,
          },
        })

        // A. Destination marker activates
        if (node) {
          cardTl.to(
            node,
            {
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#ffffff',
              boxShadow: '0 0 14px rgba(255, 255, 255, 0.75)',
              scale: 1.1,
              ease: 'power2.out',
            },
            0
          )
        }

        // B. Card reveals with subtle upward motion & border illumination
        cardTl.to(
          card,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            borderColor: 'rgba(255, 255, 255, 0.45)',
            ease: 'power2.out',
          },
          0
        )
        // Settle border to crisp dark
        cardTl.to(
          card,
          {
            borderColor: '#222222',
            ease: 'power1.out',
          },
          0.25
        )

        // C. Staggered internal text reveals
        const internalElements = [badge, title, desc, footer].filter(Boolean)
        if (internalElements.length > 0) {
          cardTl.to(
            internalElements,
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.05,
              ease: 'power2.out',
            },
            0.08
          )
        }
      })

      // 4. Final Destination: Finish Flag & Day 1 Completion Sequence
      if (finishNodeRef.current) {
        const finishTl = gsap.timeline({
          scrollTrigger: {
            trigger: finishNodeRef.current,
            start: 'top 88%',
            end: 'top 65%',
            scrub: 0.4,
          },
        })

        if (finishFlagRef.current) {
          finishTl.to(
            finishFlagRef.current,
            { scale: 1, autoAlpha: 1, ease: 'back.out(2)' },
            0
          )
        }

        if (completionBadgeRef.current) {
          finishTl.to(
            completionBadgeRef.current,
            { autoAlpha: 1, y: 0, ease: 'power2.out' },
            0.1
          )
        }

        // ONLY AFTER final destination is reached: GO TO DAY 2 button appears
        if (day2BtnRef.current) {
          finishTl.to(
            day2BtnRef.current,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              pointerEvents: 'auto',
              ease: 'back.out(1.5)',
            },
            0.22
          )
        }
      }
    }, containerRef)

    // Trigger ScrollTrigger layout calculation
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [daySchedule])

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col rounded-3xl border border-[#202020] bg-[#070707] p-5 sm:p-8 lg:p-10 shadow-2xl"
    >
      {/* Day Track Header Bar */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-[#1f1f1f] mb-8 sm:mb-10"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white text-black font-mono font-black text-sm">
            01
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

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white">
            <Sparkles className="h-3 w-3 text-white" />
            <span>LIVE TIMELINE</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#D0D0D0]">
            <Calendar className="h-3 w-3 text-white" />
            <span>4 Stations</span>
          </div>
        </div>
      </div>

      {/* Inner Track Frame */}
      <div ref={innerTrackRef} className="relative">
        {/* ====================================================================
            SCROLL-DRIVEN VECTOR TIMELINE DRAWING
            Dotted inactive line + Active fine glowing white stroke
            ==================================================================== */}
        <div
          ref={lineTrackRef}
          className="absolute left-[19px] sm:left-[29px] top-3 bottom-12 w-[2px] pointer-events-none z-0"
          aria-hidden="true"
        >
          {/* Subtle Inactive Dotted Timeline */}
          <div className="absolute inset-0 border-l-2 border-dashed border-white/20" />

          {/* Active SVG Drawing Line */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            <line
              ref={svgLineRef}
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]"
            />
          </svg>
        </div>

        {/* Waypoint Start Node */}
        <div ref={startNodeRef} className="relative pl-12 sm:pl-16 mb-8">
          <div className="absolute left-2 sm:left-4 top-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black shadow-lg z-10">
            <Navigation className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#888888]">
            <span className="text-white font-bold">ROUTE START</span>
            <ArrowRight className="h-3 w-3 text-[#555555]" />
            <span>09:00 AM DEPLOYMENT</span>
          </div>
        </div>

        {/* Milestones Flow along the Road Track */}
        <div className="space-y-6 sm:space-y-8 relative">
          {daySchedule.milestones.map((milestone, mIdx) => {
            const Icon = milestone.icon
            const isLast = mIdx === daySchedule.milestones.length - 1

            return (
              <div
                key={milestone.id}
                className="relative pl-12 sm:pl-16 group"
              >
                {/* Connecting down arrows */}
                {!isLast && (
                  <div
                    className="absolute left-[13px] sm:left-[21px] top-1/2 transform -translate-y-1/2 opacity-30 group-hover:opacity-80 transition-opacity pointer-events-none z-10"
                    aria-hidden="true"
                  >
                    <ArrowDown className="h-3 w-3 text-white" />
                  </div>
                )}

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
                  className="absolute left-2 sm:left-4 top-3.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#0c0c0c] border-2 border-white/25 text-[#666666] ring-4 ring-black shadow-md z-10 transition-colors"
                >
                  <span className="font-mono text-[10px] sm:text-xs font-bold leading-none">
                    {milestone.stepNumber}
                  </span>
                </div>

                {/* Milestone Road Card */}
                <div
                  ref={(el) => {
                    cardRefs.current[mIdx] = el
                  }}
                  className="rounded-2xl border border-[#222222] bg-[#0c0c0c] p-4 sm:p-6 transition-all duration-200 group-hover:border-white/40 group-hover:bg-[#121212] group-hover:translate-x-1 shadow-lg"
                >
                  {/* Time & Category Badge Row */}
                  <div
                    ref={(el) => {
                      cardBadgeRefs.current[mIdx] = el
                    }}
                    className="flex flex-wrap items-center justify-between gap-2.5 mb-3"
                  >
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
                  <div
                    ref={(el) => {
                      cardTitleRefs.current[mIdx] = el
                    }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white group-hover:bg-white/10 group-hover:border-white/30 transition-colors mt-0.5">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-sans text-base sm:text-lg font-bold text-white leading-snug">
                        {milestone.title}
                      </h4>
                      <p
                        ref={(el) => {
                          cardDescRefs.current[mIdx] = el
                        }}
                        className="mt-1.5 text-xs sm:text-sm text-[#A0A0A0] leading-relaxed"
                      >
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Venue / Node Footer */}
                  <div
                    ref={(el) => {
                      cardFooterRefs.current[mIdx] = el
                    }}
                    className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#777777]"
                  >
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

        {/* ====================================================================
            WAYPOINT FINISH DESTINATION & DAY 1 COMPLETION
            ==================================================================== */}
        <div className="relative pl-12 sm:pl-16 mt-8 pt-4 border-t border-[#191919]">
          {/* Finish Flag Node */}
          <div
            ref={finishNodeRef}
            className="absolute left-2 sm:left-4 top-4 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black shadow-lg z-10"
          >
            <div ref={finishFlagRef}>
              <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" />
            </div>
          </div>

          <div
            ref={completionBadgeRef}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div>
              <span className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white block">
                DAY 01 STAGE COMPLETE
              </span>
              <span className="font-mono text-[11px] text-[#A0A0A0]">
                Overnight Checkpoint Reached · All 4 Sessions Unlocked
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300 self-start sm:self-auto">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>JOURNEY COMPLETED</span>
            </div>
          </div>

          {/* ==================================================================
              DAY 1 BOTTOM ACTION: GO TO DAY 2 BUTTON
              REVEALED ONLY AFTER TIMELINE PROGRESS REACHES THE FINISHING FLAG
              ================================================================== */}
          <div className="mt-6 pt-5 border-t border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="font-sans text-xs sm:text-sm text-[#888888]">
              Ready for the next stage? Continue to Day 02 challenges.
            </p>
            <button
              ref={day2BtnRef}
              type="button"
              onClick={onGoToDay2}
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-black px-6 py-3 font-sans text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 shadow-lg"
            >
              <span>GO TO DAY 2</span>
              <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Day1CinematicTrack
