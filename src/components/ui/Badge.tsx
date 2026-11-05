import React from 'react'
import { cn } from '../../lib/utils'

export type BadgeVariant = 'primary' | 'secondary' | 'neutral' | 'tech' | 'outline'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: BadgeVariant
  withDot?: boolean
  dotColor?: 'primary' | 'secondary' | 'emerald' | 'amber'
  size?: 'sm' | 'md'
}

const variantStyles: Record<BadgeVariant, string> = {
  primary:
    'bg-accent-primary-subtle text-accent-primary border-border-accent border',
  secondary:
    'bg-accent-secondary-subtle text-accent-secondary border-border-accent-secondary border',
  neutral:
    'bg-bg-surface text-text-secondary border-border-subtle border',
  tech:
    'bg-bg-secondary text-text-secondary border-border-default border font-mono tracking-wider',
  outline:
    'bg-transparent text-text-secondary border-border-default border',
}

const dotColors = {
  primary: 'bg-accent-primary',
  secondary: 'bg-accent-secondary',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  withDot = false,
  dotColor = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full select-none font-mono font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[0.6875rem]' : 'px-3 py-1 text-caption',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {withDot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={cn(
              'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
              dotColors[dotColor],
            )}
          />
          <span
            className={cn(
              'relative inline-flex h-2 w-2 rounded-full',
              dotColors[dotColor],
            )}
          />
        </span>
      )}
      <span>{children}</span>
    </span>
  )
}

export default Badge

