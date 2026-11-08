import React, { useState, useRef } from 'react'
import { TrainGamePromo } from './TrainGamePromo'
import { Day1CinematicTrack } from './Day1CinematicTrack'
import { Day2CinematicTrack } from './Day2CinematicTrack'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Navigation,
  Compass,
  Coffee,
  Users,
  Presentation,
  CheckCircle2,
  Sparkles,
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

  const smoothScrollToScheduleTop = (targetTab: 'day1' | 'day2') => {
    const selectorEl =
      document.getElementById('day-tab-selector') ||
      document.getElementById('schedule')
    if (!selectorEl) {
      setActiveTab(targetTab)
      return
    }

    const targetY = Math.max(0, selectorEl.getBoundingClientRect().top + window.scrollY - 30)
    const startY = window.scrollY
    const distance = targetY - startY

    // If already at or very close to the top, toggle directly
    if (Math.abs(distance) < 20) {
      setActiveTab(targetTab)
      setTimeout(() => {
        ScrollTrigger.refresh()
      }, 100)
      return
    }

    const duration = 650
    const startTime = performance.now()
    let switchedTab = false

    const animateScroll = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Butter-smooth easeInOutCubic: eliminates abrupt starts, stops, or jumps
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2

      window.scrollTo(0, startY + distance * ease)

      // Switch tab at 60% of the upward glide so the tab selector pill
      // is visibly sliding to the target day right as it glides into view,
      // with ZERO scroll jitter or page height reflow jumps
      if (!switchedTab && progress >= 0.6) {
        switchedTab = true
        setActiveTab(targetTab)
      }

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        if (!switchedTab) {
          setActiveTab(targetTab)
        }
        setTimeout(() => {
          ScrollTrigger.refresh()
        }, 100)
      }
    }

    requestAnimationFrame(animateScroll)
  }

  const handleTabChange = (tab: 'day1' | 'day2') => {
    if (tab === activeTab) return
    setActiveTab(tab)
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
  }

  const visibleDays = SCHEDULE_ROADMAP.filter((day) => day.dayId === activeTab)
  const sectionRef = useRef<HTMLElement>(null)
  useScrollReveal(sectionRef, 'schedule')

  return (
    <section
      ref={sectionRef}
      id="schedule"
      className="relative z-10 w-full min-h-screen scroll-mt-16 sm:scroll-mt-20 bg-transparent text-white pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-[#1a1a1a] select-none"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto">
        {/* ==================================================================
            1. SECTION HEADER (High-Impact Editorial Header)
            ================================================================== */}
        <div data-reveal-group="header" className="mb-6 sm:mb-8">
          {/* Identification Label */}
          <div data-reveal className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <span
              className="w-[3px] h-4 sm:h-5 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.24em] text-[#D0D0D0]">
              EVENT SCHEDULE
            </span>
          </div>

          {/* Main Headline */}
          <h2 data-reveal className="font-display font-normal uppercase text-white tracking-[-0.015em] leading-[0.93] text-4xl sm:text-6xl lg:text-7xl">
            EVENT SCHEDULE
          </h2>
        </div>

        {/* ==================================================================
            2. PROMOTIONAL TRAIN GAME CALLOUT (GAME SESSION)
            "WHY SCROLL THROUGH THE SCHEDULE WHEN YOU CAN RIDE THROUGH IT?"
            ================================================================== */}
        <div data-reveal="promo" className="mb-8 sm:mb-10">
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
        <div data-reveal="day-tabs" id="day-tab-selector" className="w-full max-w-4xl mx-auto flex items-center justify-between mb-6 sm:mb-8 scroll-mt-24">
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
                onGoToDay2={() => smoothScrollToScheduleTop('day2')}
              />
            ) : (
              <Day2CinematicTrack
                key="day2-cinematic"
                daySchedule={daySchedule}
                onBackToDay1={() => smoothScrollToScheduleTop('day1')}
              />
            )
          )}
        </div>
      </div>
    </section>
  )
}

export default ScheduleRoadmapSection
