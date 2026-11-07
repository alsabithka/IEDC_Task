import React from 'react'
import { cn } from '../../lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-sans font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none'

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5 h-8',
    md: 'text-sm px-4 py-2 rounded-md gap-2 h-10',
    lg: 'text-base px-5 py-2.5 rounded-md gap-2.5 h-11',
  }[size]

  const variantClasses = {
    primary: 'bg-white text-black border border-white hover:bg-black hover:text-white shadow-sm',
    secondary:
      'bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/5',
    outline:
      'bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white',
    ghost: 'bg-transparent text-[#D0D0D0] hover:text-white hover:bg-white/5',
  }[variant]

  const classes = cn(
    baseClasses,
    sizeClasses,
    variantClasses,
    fullWidth && 'w-full',
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes} aria-disabled={disabled}>
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </a>
    )
  }

  return (
    <button type="button" className={classes} disabled={disabled} {...props}>
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}

export default Button
