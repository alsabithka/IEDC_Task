import React from 'react'
import { Sparkles } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { RegistrationForm } from '../registration/RegistrationForm'

export const RegistrationSection: React.FC = () => {
  return (
    <section id="register" className="relative z-10 w-full border-t border-[#1a1a1a] bg-transparent scroll-mt-16 sm:scroll-mt-20">
      <div className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-6 sm:pt-8 pb-16 sm:pb-20">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <span
              className="w-[3px] h-4 sm:h-5 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-[#D0D0D0]">
              {siteConfig.registration.badge}
            </span>
          </div>

          <h2 className="font-display font-normal uppercase text-white tracking-[-0.015em] leading-[0.93] text-4xl sm:text-6xl lg:text-7xl">
            {siteConfig.registration.heading}
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#A0A0A0] font-sans font-medium leading-relaxed">
            {siteConfig.registration.subtitle}
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-mono text-[#D0D0D0]">
            <Sparkles className="h-3.5 w-3.5 text-white shrink-0" />
            <span>{siteConfig.registration.disclaimer}</span>
          </div>
        </div>

        {/* Registration Form Container */}
        <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[#222222] bg-[#070707] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <RegistrationForm />
        </div>
      </div>
    </section>
  )
}

export default RegistrationSection
