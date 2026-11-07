import React, { useRef, useEffect } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  baseAlpha: number
  currentAlpha: number
  vy: number
  pulseSpeed: number
  pulseOffset: number
}

/**
 * Shared Subtle Grain & Micro-Particle Background Layer
 * 
 * - Applied to all website sections below the hero (Schedule, Promo, Registration)
 * - Ultra-fine monochrome grain texture (matte film depth)
 * - Sparse, tiny, low-opacity monochrome particles gently drifting upwards
 * - Auto-pauses when offscreen (IntersectionObserver) or in hidden tab
 * - Zero impact on layout, readability, or user interactions (pointer-events: none)
 * - Completely static fallback for prefers-reduced-motion
 */
export const ParticleBackgroundLayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animState = {
      frameId: 0 as number | null,
      isVisible: true,
      isPageHidden: false,
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const simState = {
      width: 0,
      height: 0,
      particles: [] as Particle[],
    }

    const initParticles = () => {
      const rect = container.getBoundingClientRect()
      simState.width = Math.max(rect.width, window.innerWidth)
      simState.height = Math.max(rect.height, 1000)

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = simState.width * dpr
      canvas.height = simState.height * dpr
      ctx.scale(dpr, dpr)

      // Very sparse density: ~55 on desktop, ~25 on mobile for subtle elegance
      const isMobile = simState.width < 768
      const particleCount = isMobile ? 25 : 55

      simState.particles = []
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 0.9 + 0.6 // 0.6px to 1.5px tiny specks
        const baseAlpha = Math.random() * 0.1 + 0.04 // 0.04 to 0.14 low opacity
        simState.particles.push({
          x: Math.random() * simState.width,
          y: Math.random() * simState.height,
          radius,
          baseAlpha,
          currentAlpha: baseAlpha,
          vy: Math.random() * 0.15 + 0.08, // Very gentle upward drift
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    const drawParticles = (time: number) => {
      ctx.clearRect(0, 0, simState.width, simState.height)

      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < simState.particles.length; i++) {
        const p = simState.particles[i]

        // Gentle breathing opacity pulse
        const pulse = Math.sin(time * 0.001 * p.pulseSpeed * 60 + p.pulseOffset) * 0.025
        p.currentAlpha = Math.max(0.02, Math.min(0.2, p.baseAlpha + pulse))

        ctx.globalAlpha = p.currentAlpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()

        // Drift upwards unless reduced motion requested
        if (!prefersReducedMotion) {
          p.y -= p.vy
          // Subtle horizontal wander
          p.x += Math.sin(time * 0.0005 + p.pulseOffset) * 0.05

          // Wrap around top to bottom
          if (p.y < -10) {
            p.y = simState.height + 10
            p.x = Math.random() * simState.width
          }
          if (p.x < -10) p.x = simState.width + 10
          if (p.x > simState.width + 10) p.x = -10
        }
      }
    }

    const renderLoop = (time: number) => {
      if (animState.isVisible && !animState.isPageHidden) {
        drawParticles(time)
      }

      if (!prefersReducedMotion) {
        animState.frameId = requestAnimationFrame(renderLoop)
      }
    }

    initParticles()

    // Render once for static presentation or start gentle animation loop
    if (prefersReducedMotion) {
      drawParticles(0)
    } else {
      animState.frameId = requestAnimationFrame(renderLoop)
    }

    // Resize observer to track dynamic height changes as schedule unfolds
    const resizeObserver = new ResizeObserver(() => {
      initParticles()
      if (prefersReducedMotion) {
        drawParticles(0)
      }
    })
    resizeObserver.observe(container)

    // Intersection observer to pause animation when scrolled completely out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        animState.isVisible = entry?.isIntersecting ?? true
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    // Visibility change listener to stop RAF when switching browser tabs
    const handleVisibilityChange = () => {
      animState.isPageHidden = document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (animState.frameId !== null) {
        cancelAnimationFrame(animState.frameId)
      }
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* 1. Ultra-fine micro-grain SVG texture tile (Hardware-accelerated film matte depth) */}
      <div
        className="absolute inset-0 opacity-[0.038] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />

      {/* 2. Micro-particles Canvas (Tiny monochrome ambient specks) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}

export default ParticleBackgroundLayer
