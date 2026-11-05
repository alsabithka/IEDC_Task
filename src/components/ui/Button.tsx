import React from 'react'
import { motion, type HTMLMotionProps } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'outline'
  | 'ghost'
  | 'glass'

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  href?: string
  target?: string
  rel?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-violet text-white hover:bg-accent-violet-hover shadow-glow-violet font-semibold border border-transparent',
  secondary:
    'bg-bg-surface text-text-primary border border-border-default hover:border-border-accent hover:bg-bg-surface-elevated font-medium',
  accent:
    'bg-accent-secondary text-text-primary hover:bg-accent-secondary-hover font-semibold border border-transparent',
  outline:
    'bg-transparent text-text-primary border border-border-default hover:border-accent-violet hover:text-accent-violet hover:bg-accent-violet-subtle font-medium',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent font-medium',
  glass:
    'liquid-glass text-text-primary hover:text-white hover:border-accent-violet/50 font-medium shadow-liquid-glass',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-caption px-3.5 py-1.5 rounded-sm gap-1.5 h-8',
  md: 'text-body-sm px-5 py-2.5 rounded-md gap-2 h-10',
  lg: 'text-body px-6 py-3.5 rounded-lg gap-2.5 h-12',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      href,
      target,
      rel,
      ...motionProps
    },
    ref,
  ) => {
    const baseClasses = cn(
      'group inline-flex items-center justify-center select-none font-sans transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
      variantStyles[variant],
      sizeStyles[size],
      className,
    )

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={target === '_blank' ? (rel ?? 'noopener noreferrer') : rel}
          className={baseClasses}
        >
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>}
        </a>
      )
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={baseClasses}
        {...motionProps}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && (
              <span className="shrink-0 transition-transform group-hover:translate-x-0.5">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'

export default Button
