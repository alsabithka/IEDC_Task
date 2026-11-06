import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { siteConfig } from '../../config/siteConfig'
import { cn } from '../../lib/utils'

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-bg-primary/95 backdrop-blur-sm">
      <Container size="default">
        <div className="flex h-16 items-center justify-between">
          {/* Brand / Logo Area */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex items-baseline gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded-sm"
              aria-label={`${siteConfig.brand.fullName} Home`}
            >
              <span className="font-sans text-base sm:text-lg font-semibold tracking-tight text-text-primary">
                {siteConfig.brand.name}
              </span>
              <span className="font-mono text-xs text-text-muted">
                {siteConfig.brand.edition}
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-6"
            aria-label="Main Navigation"
          >
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary rounded-sm py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Action: Optional CTA Area */}
          <div className="hidden sm:flex items-center gap-4">
            {siteConfig.cta && (
              <Button href={siteConfig.cta.href} variant="primary" size="sm">
                {siteConfig.cta.label}
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            {siteConfig.cta && (
              <Button href={siteConfig.cta.href} variant="primary" size="sm">
                {siteConfig.cta.label}
              </Button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-default bg-bg-secondary text-text-primary hover:bg-bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
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
      </Container>

      {/* Responsive Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="border-b border-border-subtle bg-bg-secondary px-4 py-4 md:hidden">
          <nav className="flex flex-col space-y-2" aria-label="Mobile Navigation">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-text-secondary',
                  'hover:bg-bg-muted hover:text-text-primary transition-colors duration-150',
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
