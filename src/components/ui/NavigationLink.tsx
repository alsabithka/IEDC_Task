import React from 'react'
import { cn } from '../../lib/utils'

export interface NavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  isActive?: boolean
  index?: string
}

export const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  children,
  isActive = false,
  index,
  className,
  ...props
}) => {
  return (
    <a
      href={href}
      className={cn(
        'group relative inline-flex items-center gap-1.5 py-1 text-body-sm font-medium transition-colors duration-200',
        isActive
          ? 'text-accent-primary'
          : 'text-text-secondary hover:text-text-primary',
        className,
      )}
      {...props}
    >
      {index && (
        <span className="font-mono text-[0.6875rem] text-text-dim transition-colors group-hover:text-accent-primary">
          {index}
        </span>
      )}
      <span>{children}</span>
      {/* Animated active underline indicator */}
      <span
        className={cn(
          'absolute bottom-0 left-0 h-[2px] bg-accent-primary transition-all duration-300',
          isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-75',
        )}
      />
    </a>
  )
}

export default NavigationLink

