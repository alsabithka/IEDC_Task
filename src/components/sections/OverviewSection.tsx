import React from 'react'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { SectionHeader } from '../ui/SectionHeader'
import { siteConfig } from '../../config/siteConfig'

export const OverviewSection: React.FC = () => {
  return (
    <section id="overview" className="py-16 sm:py-20 border-b border-border-subtle bg-bg-primary">
      <Container size="default">
        <SectionHeader
          badge={siteConfig.overview.badge}
          title={siteConfig.overview.title}
          description={siteConfig.overview.description}
        />

        {/* Core Pillars Grid */}
        <div id="pillars" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteConfig.overview.pillars.map((pillar) => (
            <Card key={pillar.id} padding="md" hover>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs font-semibold text-text-muted">
                  // {pillar.number}
                </span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-text-primary">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Factual Metrics Row */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {siteConfig.overview.metrics.map((metric, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border-subtle bg-bg-secondary p-4 text-center"
            >
              <div className="font-mono text-2xl sm:text-3xl font-bold text-text-primary">
                {metric.value}
              </div>
              <div className="mt-1 text-xs font-mono text-text-muted">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default OverviewSection

