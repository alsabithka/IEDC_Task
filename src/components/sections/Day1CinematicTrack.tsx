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
} from 'lucide-react'
import type { DaySchedule } from './ScheduleRoadmapSection'

gsap.registerPlugin(ScrollTrigger)

// Session cache tracking (in-memory + sessionStorage)
const DAY1_SESSION_STORAGE_KEY = 'iedc_day1_cinematic_cached'
let day1SessionCached = false

const isDay1Cached = (): boolean => {
  if (day1SessionCached) return true
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      if (sessionStorage.getItem(DAY1_SESSION_STORAGE_KEY) === 'true') {
        day1SessionCached = true
        return true
      }
    }
  } catch {
    // Ignore security/quota errors in restricted environments
  }
  return false
}

const markDay1Cached = () => {
  day1SessionCached = true
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem(DAY1_SESSION_STORAGE_KEY, 'true')
    }
  } catch {
    // Ignore security/quota errors
  }
}

interface Day1CinematicTrackProps {
  daySchedule: DaySchedule
  onGoToDay2?: () => void
}

/**
 * DAY 1 EVENT SCHEDULE — CINEMATIC GSAP SCROLL EXPERIENCE
 * 
 * Progressive unfolding scroll experience:
 * - Pure black-and-white editorial aesthetic (No aeroplanes, no vehicles, no decorative journey graphics)
 * - Single shared SVG for dashed inactive line and active white hairline (Zero overlapping / misalignment)
 * - Timeline stops EXACTLY at the finish flag (Zero line extends below the flag)
 * - No arrow marks between milestone cards
 * - Station destination markers illuminate as the line reaches each station
 * - Session cards reveal with subtle opacity, translateY, border flash, and staggered text
 * - Completion flag pops with spring bounce, completion badge reveals
 * - Once revealed or loaded, sessions are cached per session (no re-hiding, no loader replay when switching tabs)
 * - The line smoothly travels back and forth in accordance with scroll even after first load
 * - Supports smooth reverse scrolling and prefers-reduced-motion fallback
 */
export const Day1CinematicTrack: React.FC<Day1CinematicTrackProps> = ({
  daySchedule,
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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const cached = isDay1Cached()

    // Calculate exact geometry: Line starts at center of Start Node and ends at center of Flag Node
    const calculateLineGeometry = () => {
      if (!innerTrackRef.current || !startNodeRef.current || !finishNodeRef.current || !lineTrackRef.current) {
        return 800
      }
      const innerRect = innerTrackRef.current.getBoundingClientRect()
      const startRect = startNodeRef.current.getBoundingClientRect()
      const finishRect = finishNodeRef.current.getBoundingClientRect()

      const startY = (startRect.top - innerRect.top) + (startRect.height / 2)
      const finishY = (finishRect.top - innerRect.top) + (finishRect.height / 2)
      const totalLineLength = Math.max(0, finishY - startY)

      lineTrackRef.current.style.top = `${startY}px`
      lineTrackRef.current.style.height = `${totalLineLength}px`

      if (svgLineRef.current) {
        svgLineRef.current.setAttribute('y2', String(totalLineLength))
      }

      return totalLineLength
    }

    // CASE 1: If reduced motion is requested, immediately present all content statically
    if (prefersReducedMotion) {
      markDay1Cached()
      if (cardRefs.current) {
        gsap.set(cardRefs.current.filter(Boolean), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          borderColor: '#222222',
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
      if (finishNodeRef.current) {
        gsap.set(finishNodeRef.current, {
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
      if (svgLineRef.current) {
        const totalLineLength = calculateLineGeometry()
        gsap.set(svgLineRef.current, { strokeDasharray: totalLineLength, strokeDashoffset: 0 })
      }
      return
    }

    // CASE 2: ALREADY CACHED IN THIS SESSION
    // Skip loader/entrance animation. Keep cards and stations visible without re-animating.
    // Line continues to scrub smoothly back and forth with scroll.
    if (cached) {
      const ctx = gsap.context(() => {
        if (
          !containerRef.current ||
          !innerTrackRef.current ||
          !startNodeRef.current ||
          !finishNodeRef.current ||
          !svgLineRef.current ||
          !lineTrackRef.current
        ) {
          return
        }

        // Outer container visible immediately without delay
        gsap.set(containerRef.current, { autoAlpha: 1, y: 0 })

        // All cards visible immediately in settled state
        gsap.set(cardRefs.current.filter(Boolean), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          borderColor: '#222222',
        })

        // Staggered internal text elements visible
        gsap.set(cardBadgeRefs.current.filter(Boolean), { autoAlpha: 1, y: 0 })
        gsap.set(cardTitleRefs.current.filter(Boolean), { autoAlpha: 1, y: 0 })
        gsap.set(cardDescRefs.current.filter(Boolean), { autoAlpha: 1, y: 0 })
        gsap.set(cardFooterRefs.current.filter(Boolean), { autoAlpha: 1, y: 0 })

        // Destination markers in active illuminated state
        gsap.set(nodeRefs.current.filter(Boolean), {
          backgroundColor: '#ffffff',
          color: '#000000',
          borderColor: '#ffffff',
          boxShadow: '0 0 14px rgba(255, 255, 255, 0.75)',
          scale: 1.1,
        })

        // Finish flag node in active illuminated state
        if (finishNodeRef.current) {
          gsap.set(finishNodeRef.current, {
            backgroundColor: '#ffffff',
            color: '#000000',
            borderColor: '#ffffff',
            boxShadow: '0 0 14px rgba(255, 255, 255, 0.75)',
            scale: 1.1,
          })
        }
        if (finishFlagRef.current) {
          gsap.set(finishFlagRef.current, { scale: 1, autoAlpha: 1 })
        }
        if (completionBadgeRef.current) {
          gsap.set(completionBadgeRef.current, { autoAlpha: 1, y: 0 })
        }

        const totalLineLength = calculateLineGeometry()

        gsap.set(svgLineRef.current, {
          strokeDasharray: totalLineLength,
          strokeDashoffset: totalLineLength,
        })

        // Scroll-Driven Timeline Drawing continues to scrub back and forth with scroll
        gsap.to(svgLineRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: startNodeRef.current,
            start: 'top 65%',
            endTrigger: finishNodeRef.current,
            end: 'center center',
            scrub: 0.3,
            onRefresh: (self) => {
              const h = calculateLineGeometry()
              if (svgLineRef.current) {
                gsap.set(svgLineRef.current, {
                  strokeDasharray: h,
                  strokeDashoffset: (1 - self.progress) * h,
                })
              }
            },
          },
        })
      }, containerRef)

      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)

      return () => {
        clearTimeout(timer)
        ctx.revert()
      }
    }

    // CASE 3: FIRST VISIT IN THIS SESSION (Uncached)
    // Mark cached immediately so switching away and returning never reloads/replays
    markDay1Cached()

    const ctx = gsap.context(() => {
      if (
        !containerRef.current ||
        !innerTrackRef.current ||
        !startNodeRef.current ||
        !finishNodeRef.current ||
        !svgLineRef.current ||
        !lineTrackRef.current
      ) {
        return
      }

      const totalLineLength = calculateLineGeometry()

      gsap.set(svgLineRef.current, {
        strokeDasharray: totalLineLength,
        strokeDashoffset: totalLineLength,
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

      // Completion elements: starts dark inactive like the other numbers
      if (finishNodeRef.current) {
        gsap.set(finishNodeRef.current, {
          backgroundColor: '#0c0c0c',
          color: '#666666',
          borderColor: 'rgba(255, 255, 255, 0.22)',
          scale: 1,
        })
      }
      if (finishFlagRef.current) {
        gsap.set(finishFlagRef.current, { scale: 0.85, autoAlpha: 0.7 })
      }
      if (completionBadgeRef.current) {
        gsap.set(completionBadgeRef.current, { autoAlpha: 0, y: 10 })
      }

      // Outer Container Smooth Entrance (plays once on scroll down)
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
            toggleActions: 'play none none none',
            once: true,
          },
        }
      )

      // Scroll-Driven Timeline Drawing (Fine glowing white hairline connecting directly to the flag symbol)
      // The line smoothly travels back and forth in accordance with scroll even after first load
      gsap.to(svgLineRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: startNodeRef.current,
          start: 'top 65%',
          endTrigger: finishNodeRef.current,
          end: 'center center',
          scrub: 0.3,
          onRefresh: (self) => {
            const h = calculateLineGeometry()
            if (svgLineRef.current) {
              gsap.set(svgLineRef.current, {
                strokeDasharray: h,
                strokeDashoffset: (1 - self.progress) * h,
              })
            }
          },
        },
      })

      // Station Destinations Sequence:
      // Appears as user scrolls down for the first time.
      // Once revealed, scrolling back up does NOT disappear or replay.
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
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          },
        })

        // A. Destination marker activates to white
        if (node) {
          cardTl.to(
            node,
            {
              backgroundColor: '#ffffff',
              color: '#000000',
              borderColor: '#ffffff',
              boxShadow: '0 0 14px rgba(255, 255, 255, 0.75)',
              scale: 1.1,
              duration: 0.45,
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
            duration: 0.5,
            ease: 'power2.out',
          },
          0
        )
        // Settle border to crisp dark
        cardTl.to(
          card,
          {
            borderColor: '#222222',
            duration: 0.3,
            ease: 'power1.out',
          },
          0.3
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
              duration: 0.4,
              ease: 'power2.out',
            },
            0.1
          )
        }
      })

      // Final Destination: Finish Flag & Day 1 Completion Sequence
      // As the line approaches, the flag becomes white coloured like the other numbers.
      // Once revealed, scrolling back up does NOT disappear or replay.
      if (finishNodeRef.current) {
        const finishTl = gsap.timeline({
          scrollTrigger: {
            trigger: finishNodeRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
            once: true,
          },
        })

        // Turns white like the other numbers
        finishTl.to(
          finishNodeRef.current,
          {
            backgroundColor: '#ffffff',
            color: '#000000',
            borderColor: '#ffffff',
            boxShadow: '0 0 14px rgba(255, 255, 255, 0.75)',
            scale: 1.1,
            duration: 0.45,
            ease: 'power2.out',
          },
          0
        )

        if (finishFlagRef.current) {
          finishTl.to(
            finishFlagRef.current,
            { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)' },
            0
          )
        }

        if (completionBadgeRef.current) {
          finishTl.to(
            completionBadgeRef.current,
            { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' },
            0.1
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

        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#D0D0D0]">
          <Calendar className="h-3 w-3 text-white" />
          <span>4 Stations</span>
        </div>
      </div>

      {/* Inner Track Frame */}
      <div ref={innerTrackRef} className="relative">
        {/* ====================================================================
            SCROLL-DRIVEN VECTOR TIMELINE DRAWING
            Single SVG hosting both inactive dashed track and active glowing white stroke.
            Starts at the Route Start Node center and ends cleanly at the Finish Flag center.
            No line extends below the flag.
            ==================================================================== */}
        <div
          ref={lineTrackRef}
          className="absolute left-[19px] sm:left-[29px] w-[2px] pointer-events-none z-10"
          aria-hidden="true"
        >
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* Inactive Dashed Timeline Track */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="2"
              strokeDasharray="4 6"
            />

            {/* Active Glowing White Vector Stroke */}
            <line
              ref={svgLineRef}
              x1="0"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              className="drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]"
            />
          </svg>
        </div>

        {/* Waypoint Start Node */}
        <div ref={startNodeRef} className="relative pl-12 sm:pl-16 mb-8">
          <div className="absolute left-2 sm:left-4 top-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black shadow-lg z-30">
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
                  className="absolute left-2 sm:left-4 top-3.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#0c0c0c] border-2 border-white/25 text-[#666666] ring-4 ring-black shadow-md z-30 transition-colors"
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
            The flag sits in front of the line (z-30) and the line terminates
            at the middle of the flag. As the line approaches, the flag turns
            white like the other numbers.
            ==================================================================== */}
        <div className="relative pl-12 sm:pl-16 mt-8 pb-2">
          {/* Finish Flag Node */}
          <div
            ref={finishNodeRef}
            className="absolute left-2 sm:left-4 top-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#0c0c0c] border-2 border-white/25 text-[#666666] ring-4 ring-black shadow-md z-30 transition-colors"
          >
            <div ref={finishFlagRef} className="flex items-center justify-center">
              <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-current" />
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Day1CinematicTrack
