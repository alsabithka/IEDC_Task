import React from 'react'
import { Container } from './Container'
import { cn } from '../../lib/utils'

export type SectionBackground = 'default' | 'secondary' | 'grid' | 'dots'

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id: string
  children: React.ReactNode
  background?: SectionBackground
  containerSize?: 'narrow' | 'default' | 'wide' | 'full'
  withDividerTop?: boolean
  withDividerBottom?: boolean
  coord?: string
}

const backgroundClasses: Record<SectionBackground, string> = {
  default: 'bg-transparent',
  secondary: 'bg-bg-secondary/60 backdrop-blur-sm',
  grid: 'bg-grid-tech',
  dots: 'bg-dots-tech',
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  children,
  background = 'default',
  containerSize = 'default',
  withDividerTop = false,
  withDividerBottom = false,
  coord,
  className,
  ...props
}) => {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 sm:py-28 lg:py-32 transition-colors overflow-hidden',
        backgroundClasses[background],
        withDividerTop && 'hairline-t',
        withDividerBottom && 'hairline-b',
        className,
      )}
      {...props}
    >
      {/* Optional technical coordinate marker */}
      {coord && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-4 left-6 hidden select-none font-mono text-[0.625rem] tracking-widest text-text-dim sm:block opacity-60"
        >
          {coord}
        </div>
      )}

      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  )
}

export default SectionWrapper

