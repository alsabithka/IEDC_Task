import React, { useState } from 'react'
import { ChevronDown, AlertCircle, HelpCircle } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { cn } from '../../lib/utils'

export const FaqSection: React.FC = () => {
  // Allow toggling open FAQ items (defaults to first item open)
  const [openIds, setOpenIds] = useState<string[]>(['faq-1'])

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  return (
    <section id="faq" className="relative z-10 w-full border-t border-white/10 bg-[#000000]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-16 sm:py-24">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#D0D0D0] mb-3 block">
            {siteConfig.faq.badge}
          </span>
          <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {siteConfig.faq.heading}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#D0D0D0] leading-relaxed">
            {siteConfig.faq.subtitle}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-mono text-[#D0D0D0]">
            <HelpCircle className="h-3.5 w-3.5 text-white shrink-0" />
            <span>{siteConfig.faq.disclaimer}</span>
          </div>
        </div>

        {/* 10 FAQ Accordion Items */}
        <div className="max-w-4xl mx-auto space-y-3.5">
          {siteConfig.faq.items.map((item, index) => {
            const isOpen = openIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={cn(
                  'rounded-2xl border transition-all duration-150 overflow-hidden',
                  isOpen
                    ? 'border-white/30 bg-[#171717]'
                    : 'border-white/10 bg-[#090909] hover:border-white/20 hover:bg-[#171717]',
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-xs font-bold text-[#D0D0D0] shrink-0">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <h3 className="font-sans text-base sm:text-lg font-bold text-white">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={cn(
                      'h-7 w-7 rounded-full border border-white/15 flex items-center justify-center text-[#D0D0D0] shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180 text-white border-white/40',
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-white/5">
                    <p className="text-xs sm:text-sm text-[#D0D0D0] leading-relaxed">
                      {item.answer}
                    </p>

                    {item.statusNotice && (
                      <div className="mt-3.5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-mono text-[#D0D0D0]">
                        <AlertCircle className="h-3 w-3 text-white shrink-0" />
                        <span>{item.statusNotice}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
