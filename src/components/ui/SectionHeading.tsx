import React from 'react'
import { motion } from 'motion/react'
import { Badge } from './Badge'
import { cn } from '../../lib/utils'

export interface SectionHeadingProps {
  index?: string
  badge?: string
  title: string
  highlight?: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  badge,
  title,
  highlight,
  description,
  align = 'center',
  className,
}) => {
  const isCentered = align === 'center'

  return (
    <div
      className={cn(
        'relative mb-12 sm:mb-16',
        isCentered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl text-left',
        className,
      )}
    >
      {/* Top Meta row (Index & Badge) */}
      <div
        className={cn(
          'mb-4 flex items-center gap-3',
          isCentered ? 'justify-center' : 'justify-start',
        )}
      >
        {index && (
          <span className="font-mono text-caption font-semibold tracking-widest text-accent-primary">
            [{index}]
          </span>
        )}
        {badge && (
          <Badge variant="tech" size="sm">
            {badge}
          </Badge>
        )}
      </div>

      {/* Main Title */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-display-lg sm:text-display-xl font-bold tracking-tight text-text-primary"
      >
        {title}{' '}
        {highlight && (
          <span className="text-gradient-primary">{highlight}</span>
        )}
      </motion.h2>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'mt-4 text-body-lg text-text-secondary leading-relaxed',
            isCentered && 'mx-auto max-w-2xl',
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

export default SectionHeading

