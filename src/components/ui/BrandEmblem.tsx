import React from 'react'
import brandEmblemImg from './brandemblem.png'

export interface BrandEmblemProps {
  className?: string
  alt?: string
}

export const BrandEmblem: React.FC<BrandEmblemProps> = ({
  className = 'h-12 sm:h-14 md:h-16 w-auto object-contain shrink-0',
  alt = 'IEDC BOOTCAMP CEC Brand Emblem',
}) => {
  return (
    <img
      src={brandEmblemImg}
      alt={alt}
      className={className}
      loading="eager"
      decoding="async"
    />
  )
}

export default BrandEmblem
