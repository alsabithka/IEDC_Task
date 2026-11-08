import React from 'react'
import { FloatingBubbleBackground } from './FloatingBubbleBackground'

/**
 * ============================================================================
 * ATMOSPHERIC BACKGROUND LAYER — IEDC IDEA SPRINT 2026
 * ============================================================================
 * Medium-density glass-like bubbles floating gently across the website's dark sections.
 * Re-exports the high-performance FloatingBubbleBackground canvas implementation.
 */
export const ParticleBackgroundLayer: React.FC<{ className?: string }> = ({ className = '' }) => {
  return <FloatingBubbleBackground className={className} />
}

export default ParticleBackgroundLayer
