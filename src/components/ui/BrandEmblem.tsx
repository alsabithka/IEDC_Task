import React from 'react'
import brandEmblemPng from './brandemblem.png'
import brandEmblemWebp from './brandemblem.webp'
import { cn } from '../../lib/utils'

export interface BrandEmblemProps {
  className?: string
  alt?: string
  loading?: 'eager' | 'lazy'
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  className = 'h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0',
  alt = 'IEDC BOOTCAMP CEC Brand Emblem',
  loading = 'eager',
}) => {
  return (
    <picture className="inline-flex shrink-0">
      <source srcSet={brandEmblemWebp} type="image/webp" />
      <img
        src={brandEmblemPng}
        alt={alt}
        width={89}
        height={40}
        className={cn('brightness-0 invert object-contain', className)}
        loading={loading}
        decoding="async"
      />
    </picture>
  )
}

export default BrandEmblem
