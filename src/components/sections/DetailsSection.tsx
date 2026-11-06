import React from 'react'
import { Calendar, MapPin, Building, Info } from 'lucide-react'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'
import { siteConfig } from '../../config/siteConfig'

export const DetailsSection: React.FC = () => {
  return (
    <section id="details" className="py-16 sm:py-20 border-b border-border-subtle bg-bg-secondary">
      <Container size="default">
        <SectionHeader
          badge={siteConfig.details.badge}
          title={siteConfig.details.title}
          description={siteConfig.details.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Schedule & Dates */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-text-muted" />
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-text-muted">
                Dates & Timeline
              </h3>
            </div>
            <p className="font-sans text-xl font-medium text-text-primary">
              {siteConfig.details.dateRange}
            </p>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {siteConfig.details.duration} · {siteConfig.details.mode}
            </p>
            <div className="mt-4 flex items-start gap-2 rounded border border-border-subtle bg-bg-primary p-3 text-xs text-text-muted">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{siteConfig.details.dateNotice}</span>
            </div>
          </Card>

          {/* Card 2: Location & Host */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-text-muted" />
              <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-text-muted">
                Venue & Campus
              </h3>
            </div>
            <p className="font-sans text-xl font-medium text-text-primary">
              {siteConfig.details.venueName}
            </p>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed">
              {siteConfig.details.campus}
            </p>
            <p className="mt-1 text-xs font-mono text-text-muted">
              {siteConfig.details.location}
            </p>
            <div className="mt-4 flex items-center gap-2 pt-2 border-t border-border-subtle text-xs text-text-secondary">
              <Building className="h-3.5 w-3.5 text-text-muted" />
              <span>Organized by {siteConfig.organizer.name} ({siteConfig.organizer.cell})</span>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  )
}

export default DetailsSection

