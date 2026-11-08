import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Mail, ArrowRight, Home } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { scrollToSheet } from '../../lib/scrollUtils'
import { BrandEmblem } from '../ui/BrandEmblem'

interface NavLinkItem {
  id: string
  label: string
  href: string
  icon: React.FC<{ className?: string }>
  sublabel?: string
}

const NAV_LINKS: NavLinkItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '#home',
    icon: Home,
    sublabel: 'Back to top & event intro',
  },
  {
    id: 'schedule',
    label: 'Schedule',
    href: '#schedule',
    icon: Calendar,
    sublabel: '24-hour timeline & tracks',
  },
  {
    id: 'venue',
    label: 'Venue',
    href: '#venue',
    icon: MapPin,
    sublabel: 'CEC Campus & Navigation Radar',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#contact',
    icon: Mail,
    sublabel: 'Official event contact & coordinates',
  },
]

export const PanelHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll state for subtle header blur & border enhancement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open & close on Escape
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMenuOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [menuOpen])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToSheet(targetHref)
  }

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToSheet('#register')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full h-14 sm:h-16 transition-all duration-300 flex items-center ${
          scrolled || menuOpen
            ? 'bg-[#000000]/95 backdrop-blur-md border-b border-[#222222]'
            : 'bg-[#000000]/80 backdrop-blur-sm border-b border-[#181818]'
        }`}
      >
        <div className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between">
          {/* ================================================================
              LEFT: Brand Emblem Logo
              ================================================================ */}
          <div className="flex items-center gap-3">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm group py-1"
              aria-label={`${siteConfig.brand.fullName} Home`}
            >
              <BrandEmblem className="h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105" />
            </a>
          </div>

          {/* ================================================================
              CENTER: Desktop Navigation Links (PC View Only: md: and up)
              Strictly NO three-bar hamburger button on desktop!
              ================================================================ */}
          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Desktop Primary Navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs lg:text-sm font-sans font-medium text-[#A0A0A0] hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </nav>

          {/* ================================================================
              RIGHT: CTA (Desktop) + Mobile Controls (Mobile View Only)
              ================================================================ */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop CTA: Prominent Register Button */}
            <a
              href="#register"
              onClick={handleRegisterClick}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#EAEAEA] active:scale-95 transition-all duration-150 shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span>Register Now</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </a>

            {/* Mobile Fast Register Button (Visible on mobile for quick access) */}
            <a
              href="#register"
              onClick={handleRegisterClick}
              className="inline-flex md:hidden items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#EAEAEA] active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <span>Register</span>
            </a>

            {/* Mobile Animated Three-Bar (Hamburger) Button (STRICTLY md:hidden) */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white hover:border-white/40 hover:bg-white/10 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
              aria-label={menuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {/* Smooth Animated Hamburger to 'X' icon transition */}
              <div className="relative w-4 h-3.5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-out transform origin-left ${
                    menuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-white rounded-full transition-all duration-200 ease-out ${
                    menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-white rounded-full transition-all duration-300 ease-out transform origin-left ${
                    menuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MOBILE NAVIGATION DRAWER (Mobile View Only)
          Smooth slide-down and fade animation with backdrop blur
          ==================================================================== */}
      <div
        id="mobile-navigation-drawer"
        aria-hidden={!menuOpen}
        className={`fixed inset-x-0 top-14 sm:top-16 z-40 md:hidden bg-[#000000]/98 backdrop-blur-2xl border-b border-[#222222] shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          menuOpen
            ? 'max-h-[calc(100vh-3.5rem)] opacity-100 pointer-events-auto translate-y-0'
            : 'max-h-0 opacity-0 pointer-events-none -translate-y-2'
        }`}
      >
        <div className="max-w-[1720px] mx-auto px-5 sm:px-8 py-5 flex flex-col gap-3">
          {/* Navigation Links with Icons and Sublabels */}
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Primary Navigation">
            {NAV_LINKS.map((link, index) => {
              const IconComponent = link.icon
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    transitionDelay: menuOpen ? `${index * 40}ms` : '0ms',
                  }}
                  className={`group flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-white/15 hover:bg-white/5 active:bg-white/10 transition-all duration-200 cursor-pointer ${
                    menuOpen ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg border border-white/10 bg-[#0c0c0c] flex items-center justify-center text-[#D0D0D0] group-hover:text-white group-hover:border-white/30 transition-colors">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans font-bold text-sm text-white group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                      {link.sublabel && (
                        <span className="text-[11px] text-[#777777] font-sans">
                          {link.sublabel}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#555555] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </a>
              )
            })}
          </nav>

          {/* Primary Action Button in Drawer */}
          <div className="pt-1">
            <a
              href="#register"
              onClick={handleRegisterClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-black font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#EAEAEA] active:scale-[0.99] transition-all shadow-md cursor-pointer"
            >
              <span>Register for Idea Sprint 2026</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default PanelHeader
