import React from 'react'
import {
  Mail,
  MapPin,
  ArrowUp,
  Zap,
} from 'lucide-react'
import { Container } from '../ui'
import { EVENT_CONFIG } from '../../data/eventConfig'

// Clean SVG Brand Icons
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
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer
      id="contact"
      className="relative hairline-t bg-bg-secondary/80 text-text-secondary overflow-hidden"
      aria-label="Footer"
    >
      {/* Decorative Technical Coordinate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-8 hidden select-none font-mono text-[0.625rem] tracking-widest text-text-dim sm:block opacity-50"
      >
        FOOTER // CEC_CAMPUS_NODE
      </div>

      <Container size="default" className="py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Brand & Institutional Anchor (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-default bg-bg-surface text-accent-primary">
                <Zap className="h-5 w-5 fill-accent-primary text-accent-primary" />
              </div>
              <div>
                <h3 className="font-display text-heading-sm font-bold text-text-primary">
                  {EVENT_CONFIG.eventName} {EVENT_CONFIG.edition}
                </h3>
                <p className="font-mono text-caption text-accent-primary">
                  {EVENT_CONFIG.organizer.name}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-sm text-body-sm text-text-secondary leading-relaxed">
              {EVENT_CONFIG.organizer.cell} at{' '}
              <span className="text-text-primary font-medium">
                {EVENT_CONFIG.organizer.institution}
              </span>
              . Cultivating an ecosystem of engineering student builders, venture creators, and relentless problem solvers.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {EVENT_CONFIG.socials.linkedin && (
                <a
                  href={EVENT_CONFIG.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
                  aria-label="IEDC BOOTCAMP CEC LinkedIn"
                >
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              )}

              {EVENT_CONFIG.socials.instagram && (
                <a
                  href={EVENT_CONFIG.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
                  aria-label="IEDC BOOTCAMP CEC Instagram"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}

              {EVENT_CONFIG.socials.github && (
                <a
                  href={EVENT_CONFIG.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
                  aria-label="IEDC GitHub"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}

              {EVENT_CONFIG.socials.x && (
                <a
                  href={EVENT_CONFIG.socials.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-default bg-bg-surface text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary"
                  aria-label="IEDC X Twitter"
                >
                  <XIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Shortcuts (3 cols) */}
          <div className="lg:col-span-3">
            <span className="font-mono text-caption font-semibold uppercase tracking-wider text-text-primary">
              // Navigation Index
            </span>
            <ul className="mt-4 space-y-2.5 text-body-sm">
              {EVENT_CONFIG.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-primary"
                  >
                    <span className="font-mono text-[0.6875rem] text-text-dim group-hover:text-accent-primary">
                      [{link.index}]
                    </span>
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#register"
                  className="group inline-flex items-center gap-2 text-accent-primary transition-colors hover:underline"
                >
                  <span className="font-mono text-[0.6875rem] text-accent-primary/60">
                    [05]
                  </span>
                  <span>Register Team</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Campus Coordinates (4 cols) */}
          <div className="lg:col-span-4">
            <span className="font-mono text-caption font-semibold uppercase tracking-wider text-text-primary">
              // Contact & Campus Node
            </span>
            <div className="mt-4 space-y-3.5 text-body-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-accent-primary mt-0.5" />
                <div>
                  <p className="font-medium text-text-primary">
                    {EVENT_CONFIG.venue.name}
                  </p>
                  <p className="text-caption text-text-secondary">
                    {EVENT_CONFIG.contact.locationNotice}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent-primary" />
                <a
                  href={`mailto:${EVENT_CONFIG.contact.email}`}
                  className="font-mono text-caption text-text-primary transition-colors hover:text-accent-primary underline-offset-4 hover:underline"
                >
                  {EVENT_CONFIG.contact.email}
                </a>
              </div>

              <div className="rounded-lg border border-border-subtle bg-bg-surface/50 p-3 text-caption font-mono">
                <span className="text-text-dim block">CAMPUS INQUIRIES:</span>
                <span className="text-text-secondary mt-0.5 block">
                  {EVENT_CONFIG.contact.leadContact} • Student Coordination
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="hairline-t mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 font-mono text-caption text-text-dim">
            <span>© {currentYear} {EVENT_CONFIG.organizer.name}.</span>
            <span className="hidden sm:inline">•</span>
            <span>Web Manager Selection Assignment.</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-lg border border-border-subtle bg-bg-surface px-3 py-1.5 font-mono text-caption text-text-secondary transition-colors hover:border-accent-primary hover:text-accent-primary focus-visible:outline-none"
            aria-label="Back to top"
          >
            <span>TOP OF SYSTEM</span>
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
