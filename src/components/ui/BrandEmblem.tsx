import React from 'react'
import brandEmblemImg from './brandemblem.png'
import { cn } from '../../lib/utils'

export interface BrandEmblemProps {
  className?: string
  alt?: string
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  className = 'h-8 sm:h-9 md:h-10 w-auto object-contain shrink-0',
  alt = 'IEDC BOOTCAMP CEC Brand Emblem',
}) => {
  return (
    <img
      src={brandEmblemImg}
      alt={alt}
      className={cn('brightness-0 invert object-contain', className)}
      loading="eager"
      decoding="async"
    />
  )
}

export default BrandEmblem
