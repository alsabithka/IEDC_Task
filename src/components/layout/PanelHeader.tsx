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
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: White IEDC BOOTCAMP Logo */}
        <a
          href="#home"
          className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm group py-1"
          aria-label={`${siteConfig.brand.fullName} Home`}
        >
          <BrandEmblem className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105" />
        </a>

        {/* Right: Compact Hamburger Menu Button with subtle border */}
        <div className="flex items-center">
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
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-sans font-bold text-sm text-white">IDEA SPRINT 2026</p>
              <p className="text-xs text-[#777777] mt-0.5">A 24-hour student ideathon by IEDC BOOTCAMP CEC.</p>
            </div>
            <a
              href="#register"
              onClick={handleRegisterClick}
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-5 py-2 font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#EAEAEA] transition-all cursor-pointer"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default PanelHeader
