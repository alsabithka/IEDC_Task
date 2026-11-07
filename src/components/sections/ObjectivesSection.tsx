import React from 'react'
import { AlertCircle } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'

export const ObjectivesSection: React.FC = () => {
  return (
    <section id="objectives" className="relative z-10 w-full border-t border-white/10 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D0D0D0] mb-3 block">
            {siteConfig.objectives.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.objectives.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0D0D0] leading-relaxed">
            {siteConfig.objectives.subtitle}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono text-[#D0D0D0]">
            <AlertCircle className="h-3.5 w-3.5 text-white shrink-0" />
            <span>{siteConfig.objectives.disclaimer}</span>
          </div>
        </div>

        {/* 5 Objectives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {siteConfig.objectives.items.map((item, index) => (
            <div
              key={item.number}
              className={`rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-8 flex flex-col justify-between transition-all duration-150 hover:border-white/30 hover:bg-[#1f1f1f] hover:translate-y-[-2px] ${
                index === 3 ? 'lg:col-span-1' : ''
              } ${index === 4 ? 'lg:col-span-2' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-white">
                    // OBJECTIVE {item.number}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>
                <h3 className="font-sans text-lg sm:text-xl font-bold uppercase tracking-wide text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-[#D0D0D0] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#777777]">
                <span>IEDC BOOTCAMP CEC</span>
                <span>Pillar 0{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ObjectivesSection
