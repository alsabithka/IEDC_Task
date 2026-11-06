import React from 'react'
import { ArrowRight, Calendar, MapPin, Clock } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { siteConfig } from '../../config/siteConfig'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative py-16 sm:py-24 border-b border-border-subtle bg-bg-primary">
      <Container size="default">
        <div className="max-w-3xl">
          {/* Organization Badge */}
          <div className="mb-4">
            <Badge variant="subtle" size="sm" dot>
              {siteConfig.hero.badge}
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary leading-[1.1]">
            {siteConfig.hero.headline}
          </h1>

          {/* Tagline / Subtitle */}
          <p className="mt-4 font-mono text-xs sm:text-sm uppercase tracking-wider text-text-muted">
            {siteConfig.hero.tagline}
          </p>

          {/* Description */}
          <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
            {siteConfig.hero.description}
          </p>

          {/* Key Facts Summary */}
          <div className="mt-8 flex flex-wrap gap-y-3 gap-x-6 text-xs sm:text-sm font-mono text-text-secondary">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-muted" />
              <span>{siteConfig.details.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span>{siteConfig.details.dateRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-text-muted" />
              <span>{siteConfig.details.campus}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              href={siteConfig.hero.primaryCta.href}
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {siteConfig.hero.primaryCta.label}
            </Button>
            <Button
              href={siteConfig.hero.secondaryCta.href}
              variant="secondary"
              size="md"
            >
              {siteConfig.hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default HeroSection
