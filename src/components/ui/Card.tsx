import React from 'react'
import { cn } from '../../lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  hover = false,
  className,
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[padding]

  return (
    <div
      className={cn(
        'rounded-lg border border-border-subtle bg-bg-card text-text-primary transition-colors duration-150',
        hover && 'hover:bg-bg-card-hover hover:border-border-default',
        paddingClasses,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
