import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '../../config/siteConfig'
import { scrollToSheet } from '../../lib/scrollUtils'
import { BrandEmblem } from '../ui/BrandEmblem'

export const PanelHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollToSheet('#register')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-14 sm:h-16 bg-[#000000]/95 backdrop-blur-md border-b border-[#222222] transition-colors duration-200 flex items-center">
      <div className="w-full max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between">
        {/* Left: White IEDC BOOTCAMP Logo */}
        <a
          href="#home"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm group py-1"
          aria-label={`${siteConfig.brand.fullName} Home`}
        >
          <BrandEmblem className="h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105" />
        </a>

        {/* Right: Schedule Shortcut & Compact Hamburger Menu Button */}
        <div className="flex items-center gap-3">
          <a
            href="#schedule"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-xs font-mono uppercase tracking-wider text-[#D0D0D0] hover:text-white hover:border-white/30 transition-all cursor-pointer"
          >
            Schedule
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#0c0c0c] text-white hover:border-white/40 hover:bg-white/10 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
            aria-label={menuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Minimal Drawer / Dropdown when Hamburger is Toggled */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 w-full bg-[#000000] border-b border-[#222222] animate-in fade-in duration-150">
          <div className="max-w-[1720px] 2xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-sans font-bold text-sm text-white">IDEA SPRINT 2026</p>
              <p className="text-xs text-[#777777] mt-0.5">A 24-hour student ideathon by IEDC BOOTCAMP CEC.</p>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href="#schedule"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
              >
                Schedule
              </a>
              <a
                href="#register"
                onClick={handleRegisterClick}
                className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#EAEAEA] transition-all cursor-pointer"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default PanelHeader
