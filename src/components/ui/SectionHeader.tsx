import React from 'react'
import { Badge } from './Badge'
import { cn } from '../../lib/utils'

export interface SectionHeaderProps {
  badge?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  align = 'left',
  className,
}) => {
  return (
    <div
      className={cn(
        'mb-12 max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {badge && (
        <div className="mb-3">
          <Badge variant="neutral" size="sm">
            {badge}
          </Badge>
        </div>
      )}

      <h2 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
        {title}
      </h2>

      {description && (
        <p className="mt-3 font-sans text-base text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

// Backwards-compatible alias for SectionHeading
export const SectionHeading = SectionHeader

export default SectionHeader

