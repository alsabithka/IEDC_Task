import React from 'react'
import { Info, Clock } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'

export const JourneySection: React.FC = () => {
  return (
    <section id="journey" className="relative z-10 w-full border-t border-white/10 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D0D0D0] mb-3 block">
            {siteConfig.journey.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.journey.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0D0D0] leading-relaxed">
            {siteConfig.journey.subtitle}
          </p>

          <div className="mt-4 inline-flex items-start sm:items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-mono text-[#D0D0D0]">
            <Info className="h-4 w-4 text-white shrink-0 mt-0.5 sm:mt-0" />
            <span>{siteConfig.journey.disclaimer}</span>
          </div>
        </div>

        {/* 7 Stages Sequential Timeline / Cards */}
        <div className="relative">
          {/* Vertical Track Line for desktop */}
          <div className="hidden lg:block absolute left-[27px] top-6 bottom-6 w-[2px] bg-white/15" />

          <div className="space-y-6">
            {siteConfig.journey.stages.map((stage, idx) => (
              <div
                key={stage.stage}
                className="relative flex flex-col lg:flex-row items-start gap-5 lg:gap-8 rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-7 transition-colors hover:border-white/30 hover:bg-[#1f1f1f]"
              >
                {/* Stage Indicator Pill */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-white bg-[#000000] text-white flex items-center justify-center font-mono text-xs sm:text-sm font-bold shadow-md shadow-white/5 z-10">
                    0{idx + 1}
                  </div>
                  <div className="lg:hidden">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
                      {stage.stage}
                    </span>
                    <span className="font-mono text-[11px] text-[#777777] flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white" />
                      {stage.duration}
                    </span>
                  </div>
                </div>

                {/* Stage Content */}
                <div className="flex-1">
                  <div className="hidden lg:flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                      {stage.stage}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-xs text-[#D0D0D0]">
                      <Clock className="h-3 w-3 text-white" />
                      {stage.duration}
                    </span>
                  </div>

                  <h3 className="font-sans text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                    {stage.title}
                  </h3>

                  <p className="mt-2 text-sm text-[#D0D0D0] leading-relaxed">
                    {stage.description}
                  </p>

                  {stage.highlights && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {stage.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="rounded-md border border-white/10 bg-[#090909] px-2.5 py-1 font-mono text-[11px] text-[#D0D0D0]"
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
