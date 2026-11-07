import React from 'react'
import { Check, ArrowRight, Lightbulb, Users, Compass, Code, Rocket, Award } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'

const STEP_ICONS = [Lightbulb, Compass, Users, Code, Rocket, Award]

export const WhyParticipateSection: React.FC = () => {
  return (
    <section id="why" className="relative z-10 w-full border-t border-white/10 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* ====================================================================
            PART 1: WHY PARTICIPATE? (Ideas Need Action)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
          <div className="lg:col-span-5">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D0D0D0] mb-3 block">
              {siteConfig.whyParticipate.badge}
            </span>
            <h2 className="font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              {siteConfig.whyParticipate.heading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#D0D0D0] leading-relaxed">
              {siteConfig.whyParticipate.subtitle}
            </p>

            <div className="mt-6">
              <a
                href="#register"
                className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 font-sans text-xs font-bold uppercase tracking-wider border border-white hover:bg-black hover:text-white transition-all duration-150 shadow-md"
              >
                <span>Join the Sprint</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-8 space-y-4">
              {siteConfig.whyParticipate.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:border-white/15 hover:bg-white/[0.04]"
                >
                  <div className="h-6 w-6 rounded-full bg-white/10 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-sans text-sm sm:text-base font-medium text-white leading-relaxed">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================================================
            PART 2: HOW IT WORKS (6 Stages of Participation)
            ==================================================================== */}
        <div>
          <div className="mb-10 max-w-2xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D0D0D0] mb-2 block">
              // PARTICIPATION PROCESS
            </span>
            <h3 className="font-sans text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              How It Works
            </h3>
            <p className="mt-2 text-sm text-[#D0D0D0]">
              Proposed 6-stage roadmap for participating innovators. Actual rules and team requirements to be confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.whyParticipate.howItWorks.map((item, idx) => {
              const StepIcon = STEP_ICONS[idx % STEP_ICONS.length]
              return (
                <div
                  key={item.step}
                  className="group rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-7 transition-all duration-150 hover:border-white/30 hover:bg-[#1f1f1f]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-white">
                      // STEP 0{item.step}
                    </span>
                    <div className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white group-hover:border-white/30 group-hover:bg-white/10">
                      <StepIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <h4 className="font-sans text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#D0D0D0] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyParticipateSection
