import React from 'react'
import {
  Search,
  Sparkles,
  Users,
  Layers,
  Compass,
  Presentation,
  CheckCircle2,
} from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Search,
  Sparkles,
  Users,
  Layers,
  Compass,
  Presentation,
}

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative z-10 w-full border-t border-white/10 bg-[#241C1D]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#F0444D] mb-3 block">
            {siteConfig.about.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.about.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#C5C0C0] leading-relaxed">
            {siteConfig.about.description}
          </p>
        </div>

        {/* 2-Column Focus: What is Idea Sprint + Core Concept */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left: What is IEDC Idea Sprint */}
          <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#1D1617] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#F0444D]">
                // 24-HOUR IDEATHON
              </span>
              <h3 className="mt-2 font-sans text-xl sm:text-2xl font-bold text-white">
                {siteConfig.about.whatIsTitle}
              </h3>
              <p className="mt-4 text-sm text-[#C5C0C0] leading-relaxed">
                {siteConfig.about.whatIsDescription}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-[#8e8989]">
              <span>Hosted by {siteConfig.organizer.name}</span>
              <span>•</span>
              <span>{siteConfig.organizer.institution}</span>
            </div>
          </div>

          {/* Right: Core Concept Callout */}
          <div className="lg:col-span-5 rounded-2xl border border-[#F0444D]/30 bg-gradient-to-br from-[#1D1617] via-[#241C1D] to-[#F0444D]/10 p-6 sm:p-8 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0444D]/10 rounded-full blur-2xl pointer-events-none" />
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-[#F0444D] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Core Concept
            </span>
            <blockquote className="font-sans text-lg sm:text-xl font-medium text-white leading-snug">
              &ldquo;{siteConfig.about.coreConcept}&rdquo;
            </blockquote>
            <p className="mt-4 text-xs font-mono text-[#C5C0C0]">
              Turning initial thoughts into structured concepts.
            </p>
          </div>
        </div>

        {/* What Participants Can Expect */}
        <div>
          <div className="mb-8">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F0444D]">
              // PROGRAM EXPERIENCE
            </span>
            <h3 className="mt-1 font-sans text-xl sm:text-3xl font-bold uppercase tracking-tight text-white">
              What Participants Can Expect
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.about.expectations.map((exp, idx) => {
              const Icon = ICON_MAP[exp.iconName] || Search
              return (
                <div
                  key={exp.id}
                  className="group rounded-2xl border border-white/10 bg-[#1D1617] p-6 sm:p-7 transition-all duration-150 hover:border-white/25 hover:bg-[#201819] hover:translate-y-[-2px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl border border-white/15 bg-white/5 flex items-center justify-center text-[#F0444D] transition-colors group-hover:border-[#F0444D]/40 group-hover:bg-[#F0444D]/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-[#8e8989]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h4 className="font-sans text-base sm:text-lg font-bold text-white tracking-wide">
                    {exp.title}
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-[#C5C0C0] leading-relaxed">
                    {exp.description}
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

export default AboutSection

