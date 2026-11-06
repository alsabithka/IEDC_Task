import React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'subtle' | 'outline'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  }[size]

  const variantClasses = {
    neutral: 'bg-bg-muted text-text-secondary border border-border-default',
    subtle: 'bg-bg-secondary text-text-primary border border-border-subtle',
    outline: 'bg-transparent text-text-secondary border border-border-default',
  }[variant]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide select-none',
        sizeClasses,
        variantClasses,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  )
}

export default Badge
