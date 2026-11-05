import React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { cn } from '../../lib/utils'

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'accent'

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode
  variant?: CardVariant
  withBracket?: boolean
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-bg-secondary/80 border border-border-subtle text-text-primary backdrop-blur-sm',
  elevated:
    'bg-bg-surface border border-border-default shadow-card-elevated text-text-primary',
  interactive:
    'bg-bg-secondary/70 border border-border-subtle hover:border-border-accent hover:bg-bg-surface transition-all duration-300 text-text-primary cursor-pointer',
  accent:
    'bg-bg-surface border border-border-accent shadow-glow-primary text-text-primary',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      withBracket = false,
      className,
      ...motionProps
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-xl p-6 sm:p-8',
          withBracket && 'tech-bracket',
          variantStyles[variant],
          className,
        )}
        {...motionProps}
      >
        {children}
      </motion.div>
    )
  },
)

Card.displayName = 'Card'

export default Card

