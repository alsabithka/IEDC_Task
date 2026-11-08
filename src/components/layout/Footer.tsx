import React, { useRef } from 'react'
import { Mail, MapPin, Users, Building } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { BrandEmblem } from '../ui/BrandEmblem'
import { HeroVenueMap } from '../ui/HeroVenueMap'
import { scrollToSheet } from '../../lib/scrollUtils'
import { useScrollReveal } from '../../hooks/useScrollReveal'

// Minimal Monochrome SVG Social Icons
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
)

const GithubIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export interface FooterProps {
  onNavigateToGame?: () => void
}

/**
 * ============================================================================
 * IDEA SPRINT 2026 — OFFICIAL FOOTER
 * ============================================================================
 * - Bold editorial design system with high-impact typography
 * - Prominent closing statement: BIG IDEAS. BOLD MINDS. BUILT AT CEC.
 * - IEDC BOOTCAMP CEC identity & official brand emblem
 * - Synchronized navigation shortcuts to existing website sections & 3D game
 * - Verified official contact coordinates & social accounts
 * - Fully responsive with GSAP scroll-reveal synergy
 */
export const Footer: React.FC<FooterProps> = ({ onNavigateToGame }) => {
  const footerRef = useRef<HTMLElement>(null)
  useScrollReveal(footerRef, 'footer')

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    scrollToSheet(targetId)
  }

  const handleGameClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onNavigateToGame) {
      onNavigateToGame()
    } else {
      window.location.hash = '#/train-game'
    }
  }

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative z-10 w-full border-t border-[#1a1a1a] bg-transparent text-white select-none"
    >
      <div className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-16 sm:pt-24 lg:pt-28 pb-10 sm:pb-14">
        {/* ==================================================================
            1. MAIN CLOSING STATEMENT BANNER (HIGH-IMPACT EDITORIAL HERO CLOSING)
            ================================================================== */}
        <div
          data-reveal-group="closing"
          className="mb-16 sm:mb-20 lg:mb-24 pb-14 sm:pb-18 lg:pb-20 border-b border-[#1f1f1f]"
        >
          {/* Accent Eyebrow Label */}
          <div data-reveal className="flex items-center gap-2.5 mb-4 sm:mb-6">
            <span
              className="w-[3px] h-4 sm:h-5 bg-white shrink-0 rounded-xs"
              aria-hidden="true"
            />
            <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.24em] text-[#A0A0A0]">
              COLLEGE OF ENGINEERING CHENGANNUR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Statement Text */}
            <div className="lg:col-span-7 xl:col-span-7">
              <h2
                data-reveal
                className="font-display font-normal uppercase text-white tracking-[-0.02em] leading-[0.92] text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6.2rem]"
              >
                BIG IDEAS.<br />
                BOLD MINDS.<br />
                BUILT AT CEC.
              </h2>
              <p
                data-reveal
                className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-[#A0A0A0] font-sans font-medium max-w-xl leading-relaxed"
              >
                One idea can start something extraordinary. Bring yours to IDEA SPRINT 2026.
              </p>
            </div>

            {/* Venue Map Panel (Replacing "BE PART OF THE SPRINT") */}
            <div data-reveal className="lg:col-span-5 xl:col-span-5 lg:flex lg:justify-end w-full">
              <HeroVenueMap className="w-full max-w-[500px]" />
            </div>
          </div>
        </div>

        {/* ==================================================================
            2. STRUCTURED MULTI-COLUMN INFORMATION & NAVIGATION GRID
            ================================================================== */}
        <div
          data-reveal-group="details"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-10 pb-16 sm:pb-20"
        >
          {/* Column 1: Organization Identity & Official Socials (5 Cols) */}
          <div data-reveal className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Official Brand Emblem & Event Identity */}
              <div className="flex items-center gap-3.5 mb-4">
                <BrandEmblem className="h-10 sm:h-12 w-auto object-contain shrink-0" />
                <div>
                  <h3 className="font-sans text-base sm:text-lg font-black uppercase text-white tracking-tight leading-none">
                    {siteConfig.brand.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[#A0A0A0]">
                    {siteConfig.brand.fullName}
                  </p>
                </div>
              </div>

              {/* Official Statement */}
              <p className="text-sm sm:text-base text-[#A0A0A0] font-sans font-normal leading-relaxed max-w-md">
                IEDC BOOTCAMP CEC is building a community of student innovators, creators and entrepreneurs who turn ideas into reality.
              </p>

              {/* Cell Badge */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#888888]">
                <Building className="h-3 w-3 text-white shrink-0" />
                <span>Innovation & Entrepreneurship Development Centre · CEC</span>
              </div>
            </div>

            {/* Official Social Links */}
            <div className="mt-8">
              <span className="font-mono text-xs uppercase tracking-widest text-[#777777] block mb-3">
                Official Channels
              </span>
              <div className="flex items-center gap-2.5">
                {siteConfig.socials.instagram && (
                  <a
                    href={siteConfig.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0c0c0c] text-[#A0A0A0] hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                    aria-label="IEDC BOOTCAMP CEC on Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                )}

                {siteConfig.socials.linkedin && (
                  <a
                    href={siteConfig.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0c0c0c] text-[#A0A0A0] hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                    aria-label="IEDC BOOTCAMP CEC on LinkedIn"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                  </a>
                )}

                {siteConfig.socials.github && (
                  <a
                    href={siteConfig.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0c0c0c] text-[#A0A0A0] hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                    aria-label="IEDC BOOTCAMP CEC on GitHub"
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}

                {siteConfig.socials.x && (
                  <a
                    href={siteConfig.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0c0c0c] text-[#A0A0A0] hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-200"
                    aria-label="IEDC BOOTCAMP CEC on X (Twitter)"
                  >
                    <XIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Footer Navigation (EXPLORE) (3 Cols) */}
          <div data-reveal className="lg:col-span-3 lg:pl-4">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
              <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#D0D0D0]">
                EXPLORE
              </span>
            </div>

            <ul className="space-y-3 sm:space-y-3.5">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleAnchorClick(e, '#home')}
                  className="group inline-flex items-center gap-2.5 text-sm sm:text-base text-[#A0A0A0] hover:text-white transition-colors duration-150 font-sans font-medium cursor-pointer"
                >
                  <span className="h-[1px] w-3 bg-[#333333] group-hover:w-4 group-hover:bg-white transition-all duration-200" />
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleAnchorClick(e, '#home')}
                  className="group inline-flex items-center gap-2.5 text-sm sm:text-base text-[#A0A0A0] hover:text-white transition-colors duration-150 font-sans font-medium cursor-pointer"
                >
                  <span className="h-[1px] w-3 bg-[#333333] group-hover:w-4 group-hover:bg-white transition-all duration-200" />
                  About the Event
                </a>
              </li>
              <li>
                <a
                  href="#schedule"
                  onClick={(e) => handleAnchorClick(e, '#schedule')}
                  className="group inline-flex items-center gap-2.5 text-sm sm:text-base text-[#A0A0A0] hover:text-white transition-colors duration-150 font-sans font-medium cursor-pointer"
                >
                  <span className="h-[1px] w-3 bg-[#333333] group-hover:w-4 group-hover:bg-white transition-all duration-200" />
                  Schedule
                </a>
              </li>
              <li>
                <a
                  href="#/train-game"
                  onClick={handleGameClick}
                  className="group inline-flex items-center gap-2.5 text-sm sm:text-base text-[#A0A0A0] hover:text-white transition-colors duration-150 font-sans font-medium cursor-pointer"
                >
                  <span className="h-[1px] w-3 bg-[#333333] group-hover:w-4 group-hover:bg-white transition-all duration-200" />
                  <span>Interactive Experience</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-white/5 text-white">
                    3D
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#register"
                  onClick={(e) => handleAnchorClick(e, '#register')}
                  className="group inline-flex items-center gap-2.5 text-sm sm:text-base text-[#A0A0A0] hover:text-white transition-colors duration-150 font-sans font-medium cursor-pointer"
                >
                  <span className="h-[1px] w-3 bg-[#333333] group-hover:w-4 group-hover:bg-white transition-all duration-200" />
                  Register
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Information & Campus Coordinates (4 Cols) */}
          <div data-reveal className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden="true" />
              <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#D0D0D0]">
                CONTACT & CAMPUS
              </span>
            </div>

            <div className="space-y-4">
              {/* Official Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white mt-0.5">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#777777] block">
                    Official Event Contact
                  </span>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="font-mono text-xs sm:text-sm text-white hover:underline underline-offset-4"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              {/* Organising Team Details */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white mt-0.5">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#777777] block">
                    Organising Body
                  </span>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-white">
                    {siteConfig.organizer.name}
                  </p>
                  <p className="font-mono text-[11px] text-[#888888] mt-0.5">
                    {siteConfig.organizer.cell}
                  </p>
                </div>
              </div>

              {/* Host Institution & Campus */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white mt-0.5">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#777777] block">
                    Institution & Venue
                  </span>
                  <p className="font-sans text-xs sm:text-sm font-semibold text-white">
                    {siteConfig.brand.institution}
                  </p>
                  <p className="font-mono text-[11px] text-[#888888] mt-0.5 leading-relaxed">
                    {siteConfig.contact.locationNotice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            3. BOTTOM FOOTER STRIP
            ================================================================== */}
        <div
          data-reveal="bottom-strip"
          className="pt-8 sm:pt-10 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-[#777777]">
            © 2026 IEDC BOOTCAMP CEC. ALL RIGHTS RESERVED.
          </span>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#888888]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/40" aria-hidden="true" />
            <span>MADE WITH IDEAS AT CEC.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
