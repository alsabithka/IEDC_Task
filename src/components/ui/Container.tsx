import React from 'react'
import { cn } from '../../lib/utils'

export type ContainerSize = 'narrow' | 'default' | 'wide' | 'full'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  size?: ContainerSize
  as?: React.ElementType
}

const sizeClasses: Record<ContainerSize, string> = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1440px]',
  full: 'max-w-full',
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  as: Component = 'div',
  className,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Container

