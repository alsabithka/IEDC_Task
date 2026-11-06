import React, { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { cn } from '../../lib/utils'
import { scrollToSheet } from '../../lib/scrollUtils'
import { BrandEmblem } from '../ui/BrandEmblem'

export const PanelHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    scrollToSheet(href)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#241C1D]/90 backdrop-blur-md border-b border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-3.5 sm:py-4 flex items-center justify-between">
        {/* Left: Brand Emblem + Wordmark */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home')}
          className="flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0444D] rounded-sm group py-0.5"
          aria-label={`${siteConfig.brand.fullName} Home`}
        >
          <BrandEmblem className="h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105" />
          
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden xl:flex items-center gap-5 2xl:gap-7"
          aria-label="Panel Navigation"
        >
          {siteConfig.panelNav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-sans text-xs font-semibold uppercase tracking-wider text-[#C5C0C0] hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-sm py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Header Right Action (Desktop) */}
        <div className="hidden md:flex items-center gap-4 mr-14 sm:mr-16 lg:mr-20">
          <a
            href="#register"
            onClick={(e) => handleNavClick(e, '#register')}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#F0444D] px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#F0444D]/20 transition-all duration-150 hover:bg-[#C92E39] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>Register Now</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center xl:hidden mr-11 sm:mr-14">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0444D]"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-4 xl:hidden">
          <nav className="flex flex-col space-y-1 pt-2 border-t border-white/10">
            {siteConfig.panelNav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#C5C0C0]',
                  'hover:bg-white/5 hover:text-white transition-colors duration-150',
                )}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <a
                href="#register"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#F0444D] py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white"
              >
                <span>Register Now</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default PanelHeader
