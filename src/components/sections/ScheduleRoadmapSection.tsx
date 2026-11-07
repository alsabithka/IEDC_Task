import React, { useState } from 'react'
import { TrainGamePromo } from './TrainGamePromo'
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
  ArrowDown,
} from 'lucide-react'

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

  const visibleDays = SCHEDULE_ROADMAP.filter((day) => day.dayId === activeTab)

  return (
    <section
      id="schedule"
      className="relative w-full min-h-screen scroll-mt-16 sm:scroll-mt-20 bg-[#000000] text-white py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-t border-[#1a1a1a] select-none"
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
            3. DAY 1 / DAY 2 TAB SELECTOR (BROUGHT DOWN AFTER GAME SESSION)
            ================================================================== */}
        <div id="day-tab-selector" className="w-full max-w-4xl mx-auto flex items-center justify-between mb-6 sm:mb-8 scroll-mt-24">
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#0d0d0d] border border-[#222222]">
            <button
              type="button"
              onClick={() => setActiveTab('day1')}
              className={`px-5 sm:px-7 py-2 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'day1'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888888] hover:text-white hover:bg-white/5'
              }`}
            >
              Day 1
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('day2')}
              className={`px-5 sm:px-7 py-2 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'day2'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888888] hover:text-white hover:bg-white/5'
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
          {visibleDays.map((daySchedule) => (
            <div
              key={daySchedule.dayId}
              className="relative flex flex-col rounded-3xl border border-[#202020] bg-[#070707] p-5 sm:p-8 lg:p-10 shadow-2xl"
            >
              {/* Day Track Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-[#1f1f1f] mb-8 sm:mb-10">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-white text-black font-mono font-black text-sm">
                    {daySchedule.dayId === 'day1' ? '01' : '02'}
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
                {/* Continuous Road Center Line */}
                <div
                  className="absolute left-4 sm:left-6 top-5 bottom-0 w-0.5 border-l-2 border-dashed border-white/25"
                  aria-hidden="true"
                />

                {/* Road Start Indicator */}
                <div className="absolute left-2 sm:left-4 top-0.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black shadow-lg">
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
                {daySchedule.milestones.map((milestone, mIdx) => {
                  const Icon = milestone.icon
                  const isLast = mIdx === daySchedule.milestones.length - 1

                  return (
                    <div
                      key={milestone.id}
                      className="relative pl-12 sm:pl-16 group"
                    >
                      {/* Vertical Road Spine running through this milestone */}
                      {!isLast && (
                        <div
                          className="absolute left-4 sm:left-6 top-8 bottom-[-24px] sm:bottom-[-32px] w-0.5 border-l-2 border-dashed border-white/25 group-hover:border-white transition-colors duration-200"
                          aria-hidden="true"
                        >
                          <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity">
                            <ArrowDown className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Horizontal Connector Arm to Card */}
                      <div
                        className="absolute left-5 sm:left-7 top-6 w-5 sm:w-7 h-[1px] bg-white/20 group-hover:bg-white/50 transition-colors"
                        aria-hidden="true"
                      />

                      {/* Milestone Stop Node on the Road */}
                      <div className="absolute left-2 sm:left-4 top-3.5 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#121212] border-2 border-white text-white group-hover:bg-white group-hover:text-black transition-all duration-200 ring-4 ring-black shadow-md z-10">
                        <span className="font-mono text-[10px] sm:text-xs font-bold leading-none">
                          {milestone.stepNumber}
                        </span>
                      </div>

                      {/* Milestone Road Card */}
                      <div className="rounded-2xl border border-[#222222] bg-[#0c0c0c] p-4 sm:p-6 transition-all duration-200 group-hover:border-white/40 group-hover:bg-[#121212] group-hover:translate-x-1 shadow-lg">
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
                <div className="absolute left-2 sm:left-4 top-4 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white text-black ring-4 ring-black">
                  <Flag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {daySchedule.dayId === 'day1'
                      ? 'DAY 01 STAGE COMPLETE'
                      : 'SPRINT DESTINATION REACHED'}
                  </span>
                  <span className="font-mono text-[11px] text-[#777777]">
                    {daySchedule.dayId === 'day1'
                      ? 'Overnight Checkpoint'
                      : 'Valedictory & Awards'}
                  </span>
                </div>

                {/* Day 1 Bottom Action: Go to Day 2 Button */}
                {daySchedule.dayId === 'day1' && (
                  <div className="mt-6 pt-5 border-t border-[#1f1f1f] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="font-sans text-xs sm:text-sm text-[#888888]">
                      Ready for the next stage? Continue to Day 02 challenges.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('day2')
                        const trackEl = document.getElementById('day-tab-selector')
                        if (trackEl) {
                          trackEl.scrollIntoView({ behavior: 'smooth' })
                        }
                      }}
                      className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-white text-black px-6 py-3 font-sans text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#EAEAEA] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 shadow-lg"
                    >
                      <span>GO TO DAY 2</span>
                      <ArrowRight className="h-4 w-4 text-black group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                )}

                
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ScheduleRoadmapSection
