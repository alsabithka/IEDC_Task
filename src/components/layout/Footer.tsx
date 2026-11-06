import React, { useState } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Container } from '../ui/Container'
import { siteConfig } from '../../config/siteConfig'

// Clean SVG Social Icons
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

export const Footer: React.FC = () => {
  const [currentYear] = useState<number>(() => new Date().getFullYear())

  return (
    <footer id="contact" className="border-t border-border-subtle bg-bg-secondary text-text-secondary">
      <Container size="default" className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-8">
          {/* Organization & Brand Column */}
          <div className="md:col-span-5">
            <h3 className="font-sans text-base font-semibold text-text-primary">
              {siteConfig.brand.fullName}
            </h3>
            <p className="mt-1 font-mono text-xs text-text-muted">
              {siteConfig.organizer.name}
            </p>

            <p className="mt-3 text-sm text-text-secondary leading-relaxed max-w-sm">
              {siteConfig.organizer.cell} at{' '}
              <span className="text-text-primary">
                {siteConfig.organizer.institution}
              </span>
              . Cultivating an ecosystem of engineering student builders, venture creators, and problem solvers.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex items-center gap-3">
              {siteConfig.socials.linkedin && (
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-bg-card text-text-secondary transition-colors hover:text-text-primary hover:border-border-strong"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              )}

              {siteConfig.socials.instagram && (
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-bg-card text-text-secondary transition-colors hover:text-text-primary hover:border-border-strong"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}

              {siteConfig.socials.github && (
                <a
                  href={siteConfig.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-bg-card text-text-secondary transition-colors hover:text-text-primary hover:border-border-strong"
                  aria-label="GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}

              {siteConfig.socials.x && (
                <a
                  href={siteConfig.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border-default bg-bg-card text-text-secondary transition-colors hover:text-text-primary hover:border-border-strong"
                  aria-label="X (Twitter)"
                >
                  <XIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-text-secondary hover:text-text-primary transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="md:col-span-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-primary">
              Contact & Campus
            </h4>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-text-muted mt-0.5" />
                <span className="text-text-secondary leading-snug">
                  {siteConfig.contact.locationNotice}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="font-mono text-xs text-text-secondary hover:text-text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-text-muted">
          <div>
            © {currentYear} {siteConfig.organizer.name}. All rights reserved.
          </div>
          <div>
            {siteConfig.organizer.institution}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
