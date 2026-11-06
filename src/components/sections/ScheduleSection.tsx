import React, { useState } from 'react'
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { cn } from '../../lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  'Check-in': 'border-blue-500/30 text-blue-400 bg-blue-500/10',
  Keynote: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  Sprint: 'border-[#F0444D]/30 text-[#F0444D] bg-[#F0444D]/10',
  Mentoring: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  Review: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  Presentation: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  Ceremony: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
  Break: 'border-white/20 text-white/70 bg-white/5',
}

export const ScheduleSection: React.FC = () => {
  const [activeDay, setActiveDay] = useState<'day1' | 'day2'>('day1')

  const scheduleData = activeDay === 'day1' ? siteConfig.schedule.day1 : siteConfig.schedule.day2

  return (
    <section id="schedule" className="relative z-10 w-full border-t border-white/10 bg-[#241C1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F0444D] mb-3 block">
            {siteConfig.schedule.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.schedule.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#C5C0C0] leading-relaxed">
            {siteConfig.schedule.subtitle}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-mono text-[#C5C0C0]">
            <AlertCircle className="h-3.5 w-3.5 text-[#F0444D] shrink-0" />
            <span>{siteConfig.schedule.disclaimer}</span>
          </div>
        </div>

        {/* Day 1 / Day 2 Tab Selector */}
        <div className="flex items-center gap-3 mb-10">
          <button
            type="button"
            onClick={() => setActiveDay('day1')}
            className={cn(
              'flex items-center gap-2.5 rounded-full px-5 sm:px-7 py-3 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              activeDay === 'day1'
                ? 'bg-[#F0444D] text-white shadow-lg shadow-[#F0444D]/25'
                : 'border border-white/15 bg-[#1D1617] text-[#C5C0C0] hover:text-white hover:border-white/30',
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Day 01 Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDay('day2')}
            className={cn(
              'flex items-center gap-2.5 rounded-full px-5 sm:px-7 py-3 font-sans text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              activeDay === 'day2'
                ? 'bg-[#F0444D] text-white shadow-lg shadow-[#F0444D]/25'
                : 'border border-white/15 bg-[#1D1617] text-[#C5C0C0] hover:text-white hover:border-white/30',
            )}
          >
            <Calendar className="h-4 w-4" />
            <span>Day 02 Timeline</span>
          </button>
        </div>

        {/* Schedule Header Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <h3 className="font-sans text-lg sm:text-xl font-bold uppercase text-white">
            {scheduleData.title}
          </h3>
          <span className="font-mono text-xs text-[#F0444D]">
            {scheduleData.dateLabel}
          </span>
        </div>

        {/* Chronological Timeline Items */}
        <div className="space-y-4">
          {scheduleData.items.map((item, index) => {
            const badgeClass =
              CATEGORY_COLORS[item.category] || 'border-white/20 text-white/80 bg-white/5'

            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-white/10 bg-[#1D1617] p-5 sm:p-6 transition-all duration-150 hover:border-white/20 hover:bg-[#201819]"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Time & Activity Title */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#F0444D]">
                        <Clock className="h-3.5 w-3.5" />
                        {item.time}
                      </span>

                      <span
                        className={cn(
                          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider',
                          badgeClass,
                        )}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h4 className="font-sans text-base sm:text-lg font-bold text-white group-hover:text-white/95">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm text-[#C5C0C0] leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Venue / Node */}
                  {item.venue && (
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#8e8989] shrink-0 md:pt-1">
                      <MapPin className="h-3.5 w-3.5 text-[#F0444D]" />
                      <span>{item.venue}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8e8989]">
                  <span>Chronological Step 0{index + 1}</span>
                  <span>College of Engineering Chengannur</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ScheduleSection

