import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, ArrowUpRight, Hourglass } from 'lucide-react'
import { Button, Badge } from '../ui'
import { EVENT_CONFIG } from '../../data/eventConfig'
import { cn } from '../../lib/utils'

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      // Active section detector based on scroll position
      const sections = ['about', 'schedule', 'why-participate', 'contact']
      const scrollPos = window.scrollY + 200

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId)
            return
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-bg-primary/85 backdrop-blur-md hairline-b py-3 shadow-lg'
          : 'bg-transparent py-4 sm:py-5',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo: HOURGLASS & IEDC */}
        <a
          href="#"
          className="group flex items-center gap-3 focus-visible:outline-none"
          aria-label="HOURGLASS IEDC IDEA SPRINT 2026 Home"
        >
          {/* Hourglass Physical Glyph */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-accent-violet transition-all duration-300 group-hover:border-accent-violet group-hover:shadow-glow-violet">
            <Hourglass className="h-4 w-4 text-accent-violet" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-fraunces text-heading-sm font-bold tracking-tight text-text-primary">
                HOURGLASS
              </span>
              <span className="font-ibm text-[0.6875rem] font-semibold text-accent-violet">
                '{EVENT_CONFIG.edition.slice(2)}
              </span>
            </div>
            <span className="font-ibm text-[0.625rem] tracking-wider text-text-secondary uppercase">
              {EVENT_CONFIG.organizer.name}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-8 rounded-full border border-border-subtle bg-bg-secondary/70 px-6 py-2 backdrop-blur-sm lg:flex"
          aria-label="Main Navigation"
        >
          {EVENT_CONFIG.navLinks.map((link) => {
            const isActive = activeSection === link.href.replace('#', '')
            return (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative py-1 font-inter text-body-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'text-accent-violet'
                    : 'text-text-secondary hover:text-text-primary',
                )}
              >
                <span className="font-ibm text-[0.6875rem] text-text-dim transition-colors group-hover:text-accent-violet mr-1.5">
                  [{link.index}]
                </span>
                <span>{link.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="navbar-active-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-accent-violet shadow-glow-violet"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right Action: Status Chip & Liquid Glass CTA */}
        <div className="hidden items-center gap-4 sm:flex">
          <Badge variant="primary" withDot dotColor="primary" size="sm" className="hidden xl:inline-flex border-accent-violet/30 text-accent-violet bg-accent-violet/10">
            CHRONO LIVE
          </Badge>

          <Button
            href="#register"
            variant="glass"
            size="sm"
            rightIcon={<ArrowUpRight className="h-4 w-4" />}
          >
            Register Now
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button
            href="#register"
            variant="glass"
            size="sm"
            className="sm:hidden text-caption px-3 py-1.5 h-8"
          >
            Register
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-primary transition-colors hover:border-accent-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-accent-violet" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-border-default bg-bg-secondary/95 px-4 pt-2 pb-6 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-2 pt-2">
              <div className="mb-2 px-3">
                <span className="font-ibm text-[0.6875rem] font-semibold uppercase tracking-wider text-text-dim">
                  Navigation Index
                </span>
              </div>
              {EVENT_CONFIG.navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 font-inter text-body font-medium text-text-primary transition-colors hover:bg-bg-surface hover:text-accent-violet"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-ibm text-caption text-text-dim">
                      [{link.index}]
                    </span>
                    <span>{link.label}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-text-dim" />
                </a>
              ))}

              <div className="hairline-t mt-4 pt-4 px-2">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-ibm text-caption text-text-secondary">
                    Status:
                  </span>
                  <Badge variant="primary" withDot size="sm" className="border-accent-violet/30 text-accent-violet bg-accent-violet/10">
                    Open for Teams
                  </Badge>
                </div>
                <Button
                  href="#register"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={handleLinkClick}
                  rightIcon={<ArrowUpRight className="h-4 w-4" />}
                >
                  Register Idea for Sprint
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
