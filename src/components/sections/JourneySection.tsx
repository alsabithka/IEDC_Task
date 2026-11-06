import React from 'react'
import { Info, Clock } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'

export const JourneySection: React.FC = () => {
  return (
    <section id="journey" className="relative z-10 w-full border-t border-white/10 bg-[#241C1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F0444D] mb-3 block">
            {siteConfig.journey.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.journey.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#C5C0C0] leading-relaxed">
            {siteConfig.journey.subtitle}
          </p>

          <div className="mt-4 inline-flex items-start sm:items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3.5 py-2 text-xs font-mono text-amber-300">
            <Info className="h-4 w-4 shrink-0 mt-0.5 sm:mt-0" />
            <span>{siteConfig.journey.disclaimer}</span>
          </div>
        </div>

        {/* 7 Stages Sequential Timeline / Cards */}
        <div className="relative">
          {/* Vertical Track Line for desktop */}
          <div className="hidden lg:block absolute left-[27px] top-6 bottom-6 w-[2px] bg-white/10" />

          <div className="space-y-6">
            {siteConfig.journey.stages.map((stage, idx) => (
              <div
                key={stage.stage}
                className="relative flex flex-col lg:flex-row items-start gap-5 lg:gap-8 rounded-2xl border border-white/10 bg-[#1D1617] p-6 sm:p-7 transition-colors hover:border-white/20 hover:bg-[#201819]"
              >
                {/* Stage Indicator Pill */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-[#F0444D] bg-[#241C1D] text-white flex items-center justify-center font-mono text-xs sm:text-sm font-bold shadow-md shadow-[#F0444D]/20 z-10">
                    0{idx + 1}
                  </div>
                  <div className="lg:hidden">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F0444D] block">
                      {stage.stage}
                    </span>
                    <span className="font-mono text-[11px] text-[#8e8989] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stage.duration}
                    </span>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="flex-1">
                  <div className="hidden lg:flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F0444D]">
                      {stage.stage}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-[#C5C0C0]">
                      <Clock className="h-3 w-3 text-[#F0444D]" />
                      {stage.duration}
                    </span>
                  </div>

                  <h3 className="font-sans text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                    {stage.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#C5C0C0] leading-relaxed">
                    {stage.description}
                  </p>

                  {stage.highlights && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-white/10 bg-[#241C1D] px-2.5 py-1 font-mono text-[11px] text-white/80"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default JourneySection

