import React, { useRef, useEffect } from 'react'

/**
 * ============================================================================
 * FLOATING BUBBLE BACKGROUND COMPONENT — IEDC IDEA SPRINT 2026
 * ============================================================================
 * - Atmospheric medium-density glass-like bubbles floating gently across dark sections
 * - Balanced, natural distribution (35–55 visible bubbles per viewport on desktop, 20–30 on mobile)
 * - Varied sizes (mostly tiny 3–6px, occasional medium 7–12px)
 * - Translucent white, light grey, and subtle charcoal tones with delicate outlines and highlights
 * - Smooth continuous upward float with gentle sideways drift
 * - Optimized 2D Canvas with IntersectionObserver & PageVisibility pausing
 * - Zero impact on layout or interaction (pointer-events: none, z-index: 0)
 * - Accessible: Respects prefers-reduced-motion with a single static frame
 */

interface Bubble {
  x: number
  y: number
  baseX: number
  radius: number
  diameter: number
  baseAlpha: number
  currentAlpha: number
  vy: number
  swaySpeed: number
  swayAmp: number
  swayOffset: number
  pulseSpeed: number
  pulseOffset: number
  tone: 'white' | 'lightGrey' | 'charcoal'
}

export interface FloatingBubbleBackgroundProps {
  className?: string
}

export const FloatingBubbleBackground: React.FC<FloatingBubbleBackgroundProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const animState = {
      frameId: 0 as number | null,
      isVisible: true,
      isPageHidden: false,
      lastTime: 0,
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const simState = {
      width: 0,
      height: 0,
      bubbles: [] as Bubble[],
    }

    /**
     * Initializes bubbles using stratified cell jittering to guarantee:
     * 1. Target density of 35–55 visible bubbles per desktop viewport (~20–30 on mobile).
     * 2. Natural organic spread without artificial grid alignment.
     * 3. Zero overcrowded clusters and zero large empty voids.
     */
    const initBubbles = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.max(rect.width, window.innerWidth)
      const height = Math.max(rect.height, 1200)

      simState.width = width
      simState.height = height

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      const isMobile = width < 768
      // Grid cell dimensions calibrated to guarantee 35–55 visible bubbles in a 900px desktop viewport (~20–30 on mobile)
      const cellWidth = isMobile ? 85 : 130
      const cellHeight = isMobile ? 90 : 135

      const cols = Math.ceil(width / cellWidth)
      const rows = Math.ceil(height / cellHeight)

      simState.bubbles = []

      // Spawn probability per cell (~65% on desktop, ~60% on mobile) to maintain 35–55 density without grid rigidity
      const spawnProb = isMobile ? 0.60 : 0.65

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > spawnProb) continue

          const cellX = c * cellWidth
          const cellY = r * cellHeight

          const x = cellX + Math.random() * cellWidth
          const y = cellY + Math.random() * cellHeight

          // Size distribution:
          // ~75% tiny delicate bubbles (diameter 3px to 6.2px, radius 1.5 to 3.1px)
          // ~25% occasional medium bubbles (diameter 6.6px to 12px, radius 3.3 to 6.0px)
          const isMedium = Math.random() < 0.25
          const radius = isMedium
            ? Math.random() * 2.7 + 3.3   // 3.3px to 6.0px (diameter 6.6px - 12px)
            : Math.random() * 1.6 + 1.5   // 1.5px to 3.1px (diameter 3px - 6.2px)

          const diameter = radius * 2

          // Opacity calibrated strictly within 10%–35% (visible against dark background without looking bright or distracting)
          const baseAlpha = isMedium
            ? Math.random() * 0.14 + 0.14 // 0.14 to 0.28
            : Math.random() * 0.18 + 0.16 // 0.16 to 0.34

          // Color tones: translucent white, light grey, subtle charcoal
          const toneRand = Math.random()
          const tone: 'white' | 'lightGrey' | 'charcoal' =
            toneRand < 0.68 ? 'white' : toneRand < 0.88 ? 'lightGrey' : 'charcoal'

          // Vertical drift speed: 0.18 to 0.38 px/frame (slow, tranquil continuous upward float)
          const vy = Math.random() * 0.20 + 0.18

          // Sideways sinusoidal sway with independent path & duration
          const swayAmp = Math.random() * 16 + 10 // 10px to 26px amplitude
          const swaySpeed = Math.random() * 0.0008 + 0.0006 // gentle asynchronous frequency
          const swayOffset = Math.random() * Math.PI * 2

          // Subtle opacity breathing (gentle continuous variation)
          const pulseSpeed = Math.random() * 0.0010 + 0.0006
          const pulseOffset = Math.random() * Math.PI * 2

          simState.bubbles.push({
            x,
            y,
            baseX: x,
            radius,
            diameter,
            baseAlpha,
            currentAlpha: baseAlpha,
            vy,
            swaySpeed,
            swayAmp,
            swayOffset,
            pulseSpeed,
            pulseOffset,
            tone,
          })
        }
      }
    }

    /**
     * Renders a single glass-like bubble with delicate outline, translucent body,
     * and subtle specular highlight.
     */
    const renderBubble = (b: Bubble) => {
      const { x, y, radius: r, currentAlpha: a, tone } = b

      let cr = 255
      let cg = 255
      let cb = 255

      if (tone === 'lightGrey') {
        cr = 220
        cg = 225
        cb = 230
      } else if (tone === 'charcoal') {
        cr = 180
        cg = 185
        cb = 195
      }

      // 1. Translucent Glass Body (Soft Radial Refraction)
      const grad = ctx.createRadialGradient(
        x - r * 0.32,
        y - r * 0.35,
        Math.max(0.5, r * 0.15),
        x,
        y,
        r
      )

      grad.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${a * 0.45})`)
      grad.addColorStop(0.65, `rgba(${cr}, ${cg}, ${cb}, ${a * 0.12})`)
      grad.addColorStop(0.92, `rgba(${cr}, ${cg}, ${cb}, ${a * 0.26})`)
      grad.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, ${a * 0.52})`)

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()

      // 2. Delicate Outline Ring
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${Math.min(0.48, a * 1.4)})`
      ctx.lineWidth = Math.min(1.0, Math.max(0.65, r * 0.16))
      ctx.stroke()

      // 3. Specular Highlight Reflection (for bubbles radius >= 2.0px)
      if (r >= 2.0) {
        const hx = x - r * 0.36
        const hy = y - r * 0.40
        const hr = Math.max(0.5, r * 0.25)

        ctx.beginPath()
        ctx.arc(hx, hy, hr, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(0.58, a * 1.7)})`
        ctx.fill()

        // Secondary subtle rim reflection for medium bubbles (radius >= 4.2px)
        if (r >= 4.2) {
          const rx = x + r * 0.32
          const ry = y + r * 0.34
          const rr = r * 0.16

          ctx.beginPath()
          ctx.arc(rx, ry, rr, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.6})`
          ctx.fill()
        }
      }
    }

    /**
     * Animation frame update: moves bubbles upwards and sways sideways gently.
     */
    const updateAndDraw = (time: number) => {
      ctx.clearRect(0, 0, simState.width, simState.height)

      const bubbles = simState.bubbles
      const total = bubbles.length

      for (let i = 0; i < total; i++) {
        const b = bubbles[i]

        // 1. Subtle breathing opacity
        const pulse = Math.sin(time * b.pulseSpeed + b.pulseOffset) * (b.baseAlpha * 0.20)
        b.currentAlpha = Math.max(0.08, Math.min(0.36, b.baseAlpha + pulse))

        // 2. Gentle sinusoidal sideways sway
        b.x = b.baseX + Math.sin(time * b.swaySpeed + b.swayOffset) * b.swayAmp

        // 3. Upward vertical float (unless reduced motion)
        if (!prefersReducedMotion) {
          b.y -= b.vy

          // When bubble drifts past the top of the container, wrap smoothly to the bottom
          if (b.y < -b.radius * 2) {
            b.y = simState.height + b.radius * 2
            b.baseX = Math.random() * simState.width
            b.x = b.baseX
          }
        }

        renderBubble(b)
      }
    }

    const renderLoop = (time: number) => {
      if (animState.isVisible && !animState.isPageHidden) {
        updateAndDraw(time)
      }

      if (!prefersReducedMotion) {
        animState.frameId = requestAnimationFrame(renderLoop)
      }
    }

    initBubbles()

    if (prefersReducedMotion) {
      updateAndDraw(0)
    } else {
      animState.frameId = requestAnimationFrame(renderLoop)
    }

    // Dynamic resize tracking (e.g. when schedule expands)
    const resizeObserver = new ResizeObserver(() => {
      initBubbles()
      if (prefersReducedMotion) {
        updateAndDraw(0)
      }
    })
    resizeObserver.observe(container)

    // Viewport intersection observer to pause RAF when completely scrolled out of view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        animState.isVisible = entry?.isIntersecting ?? true
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(container)

    // Visibility change observer to pause RAF when switching browser tabs
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
      className={`absolute inset-0 pointer-events-none select-none z-0 overflow-hidden ${className}`}
    >
      {/* 1. Subtle Fine-Grain Film Noise Texture Tile (Eliminates flat black voids with organic matte depth) */}
      <div
        className="absolute inset-0 opacity-[0.065] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
        aria-hidden="true"
      />

      {/* 2. Floating Bubbles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}

export default FloatingBubbleBackground
