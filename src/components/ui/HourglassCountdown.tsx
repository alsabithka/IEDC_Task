import React, { useRef, useEffect, useMemo } from 'react'
import { useReducedMotion } from '../../animations/useReducedMotion'
import type { CountdownTime } from '../../hooks/useCountdown'

export interface HourglassCountdownProps {
  countdown: CountdownTime
  targetDateISO: string
  // Optional start time to calculate totalDuration, defaults to 24h before target
  startDateISO?: string
  className?: string
  width?: number
  height?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

const SAND_COLORS = ['#F5E6BE', '#E2C799', '#D4AF37', '#C5A059', '#B8934A']

/**
 * Permanent, stationary physical Hourglass suspended in deep space.
 * - Strict requirement: Camera, scale, rotation, and position are completely fixed.
 * - Upper and lower chambers contain realistic champagne/warm pale gold granular sand.
 * - Sand levels act as the real-time visual countdown source of truth.
 * - Cosmic effects remain strictly outside the glass.
 */
export const HourglassCountdown: React.FC<HourglassCountdownProps> = ({
  countdown,
  targetDateISO,
  startDateISO,
  className = '',
  width = 300,
  height = 460,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const prefersReduced = useReducedMotion()

  // Track progress ref for 60fps render loop without triggering React re-renders
  const progressRef = useRef<number>(0)
  const isCompleteRef = useRef<boolean>(countdown.isComplete)

  // Compute normalized progress (0.0 to 1.0)
  // 0.0 = sprint start (upper chamber 100% full, lower 0%)
  // 1.0 = sprint end (upper chamber 0% empty, lower 100% full)
  const calculatedProgress = useMemo(() => {
    if (countdown.isComplete) return 1

    const targetTime = new Date(targetDateISO).getTime()
    // If no explicit startDateISO, assume a 24-hour sprint window (86,400,000 ms)
    const startTime = startDateISO
      ? new Date(startDateISO).getTime()
      : targetTime - 24 * 60 * 60 * 1000

    const now = Date.now()
    const totalDuration = Math.max(1000, targetTime - startTime)
    const elapsed = now - startTime

    const prog = Math.max(0, Math.min(1, elapsed / totalDuration))
    return prog
  }, [countdown.isComplete, targetDateISO, startDateISO])

  useEffect(() => {
    progressRef.current = calculatedProgress
    isCompleteRef.current = countdown.isComplete
  }, [calculatedProgress, countdown.isComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // High-DPI support
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Pre-create sand stream particles
    const streamParticles: Particle[] = []
    const MAX_STREAM_PARTICLES = 35

    // Geometric Anchors (Fixed coordinate space: 300x460)
    const cx = width / 2 // 150
    const topCapY = 32
    const bottomCapY = height - 32 // 428
    const neckY = height / 2 // 230
    const neckHalfWidth = 7 // 14px neck
    const bulbMaxRadius = 88 // Bulb outward width

    let animationFrameId: number
    let streamTick = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const progress = progressRef.current
      const isComplete = isCompleteRef.current || progress >= 1.0

      // ======================================================================
      // 1. DRAW SAND IN UPPER CHAMBER (Decreasing level + crater funnel)
      // ======================================================================
      const upperRemaining = Math.max(0, 1 - progress)

      if (upperRemaining > 0.005) {
        ctx.save()

        // Clip to upper bulb glass interior
        ctx.beginPath()
        ctx.moveTo(cx - 78, topCapY + 8)
        ctx.bezierCurveTo(
          cx - 86, topCapY + 50,
          cx - bulbMaxRadius, neckY - 50,
          cx - neckHalfWidth, neckY - 2
        )
        ctx.lineTo(cx + neckHalfWidth, neckY - 2)
        ctx.bezierCurveTo(
          cx + bulbMaxRadius, neckY - 50,
          cx + 86, topCapY + 50,
          cx + 78, topCapY + 8
        )
        ctx.closePath()
        ctx.clip()

        // Upper sand level calculates from remaining volume
        // When remaining is 1.0 -> yTop is near topCapY + 12
        // When remaining is 0.0 -> yTop reaches neckY - 2
        const upperHeightAvailable = neckY - (topCapY + 16)
        const currentSandY = topCapY + 16 + (1 - upperRemaining) * upperHeightAvailable

        // Funnel / crater depression in the center towards the neck
        const funnelDepression = Math.sin(upperRemaining * Math.PI) * 14

        // Draw upper sand body
        ctx.beginPath()
        ctx.moveTo(cx - bulbMaxRadius - 10, currentSandY)
        // Natural curved crater surface dipping towards the central neck
        ctx.bezierCurveTo(
          cx - 40, currentSandY + funnelDepression * 0.8,
          cx + 40, currentSandY + funnelDepression * 0.8,
          cx + bulbMaxRadius + 10, currentSandY
        )
        // Downward towards neck
        ctx.lineTo(cx + bulbMaxRadius + 10, neckY)
        ctx.lineTo(cx - bulbMaxRadius - 10, neckY)
        ctx.closePath()

        // Realistic champagne gold gradient
        const upperGrad = ctx.createLinearGradient(0, currentSandY, 0, neckY)
        upperGrad.addColorStop(0, '#F5E6BE') // Pale gold light
        upperGrad.addColorStop(0.3, '#E2C799') // Warm champagne sand
        upperGrad.addColorStop(0.7, '#D4AF37') // Rich golden amber
        upperGrad.addColorStop(1, '#C5A059') // Dense shadow gold
        ctx.fillStyle = upperGrad
        ctx.fill()

        // Fine granular stipple texture in upper chamber
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
        for (let i = 0; i < 40; i++) {
          const gx = cx - 55 + ((i * 19) % 110)
          const gy = currentSandY + 6 + ((i * 31) % Math.max(10, neckY - currentSandY - 12))
          ctx.fillRect(gx, gy, 1.2, 1.2)
        }

        ctx.restore()
      }

      // ======================================================================
      // 2. DRAW SAND IN LOWER CHAMBER (Accumulating conical mound)
      // ======================================================================
      const lowerAccumulated = Math.min(1, progress)

      if (lowerAccumulated > 0.005) {
        ctx.save()

        // Clip to lower bulb glass interior
        ctx.beginPath()
        ctx.moveTo(cx - neckHalfWidth, neckY + 2)
        ctx.bezierCurveTo(
          cx - bulbMaxRadius, neckY + 50,
          cx - 86, bottomCapY - 50,
          cx - 78, bottomCapY - 8
        )
        ctx.lineTo(cx + 78, bottomCapY - 8)
        ctx.bezierCurveTo(
          cx + 86, bottomCapY - 50,
          cx + bulbMaxRadius, neckY + 50,
          cx + neckHalfWidth, neckY + 2
        )
        ctx.closePath()
        ctx.clip()

        // Mound height grows with lowerAccumulated
        const maxMoundHeight = (bottomCapY - 10) - (neckY + 36)
        const currentMoundHeight = lowerAccumulated * maxMoundHeight
        const moundApexY = (bottomCapY - 8) - currentMoundHeight

        // Conical mound with angle of repose
        const moundSpread = Math.min(bulbMaxRadius + 10, 45 + lowerAccumulated * 55)

        ctx.beginPath()
        ctx.moveTo(cx - moundSpread, bottomCapY - 6)
        // Curved natural cone peak where stream lands
        ctx.bezierCurveTo(
          cx - moundSpread * 0.45, moundApexY + 12,
          cx - 12, moundApexY,
          cx, moundApexY
        )
        ctx.bezierCurveTo(
          cx + 12, moundApexY,
          cx + moundSpread * 0.45, moundApexY + 12,
          cx + moundSpread, bottomCapY - 6
        )
        ctx.lineTo(cx + moundSpread, bottomCapY + 10)
        ctx.lineTo(cx - moundSpread, bottomCapY + 10)
        ctx.closePath()

        // Realistic champagne gold gradient
        const lowerGrad = ctx.createLinearGradient(0, moundApexY, 0, bottomCapY)
        lowerGrad.addColorStop(0, '#F5E6BE') // Highlights at the apex
        lowerGrad.addColorStop(0.25, '#E2C799') // Natural champagne body
        lowerGrad.addColorStop(0.65, '#D4AF37') // Core amber
        lowerGrad.addColorStop(1, '#9E7833') // Depth shadow at base
        ctx.fillStyle = lowerGrad
        ctx.fill()

        // Surface texture & highlight rim on mound
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Grain stippling in lower mound
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
        for (let i = 0; i < 50; i++) {
          const gx = cx - 60 + ((i * 23) % 120)
          const gy = moundApexY + 8 + ((i * 17) % Math.max(8, currentMoundHeight))
          if (gy < bottomCapY - 6) {
            ctx.fillRect(gx, gy, 1.2, 1.2)
          }
        }

        ctx.restore()
      }

      // ======================================================================
      // 3. CONTINUOUS FALLING SAND STREAM & PARTICLES
      // ======================================================================
      if (!isComplete && !prefersReduced && upperRemaining > 0.005) {
        streamTick++

        // Mound apex Y where stream impacts
        const maxMoundHeight = (bottomCapY - 10) - (neckY + 36)
        const currentMoundHeight = lowerAccumulated * maxMoundHeight
        const moundApexY = (bottomCapY - 8) - currentMoundHeight

        // Solid central jet
        const streamWidth = 2.8 + Math.sin(streamTick * 0.2) * 0.4

        const streamGrad = ctx.createLinearGradient(0, neckY, 0, moundApexY)
        streamGrad.addColorStop(0, '#F5E6BE')
        streamGrad.addColorStop(0.5, '#E2C799')
        streamGrad.addColorStop(1, '#D4AF37')

        ctx.beginPath()
        ctx.moveTo(cx - streamWidth / 2, neckY - 2)
        ctx.lineTo(cx - streamWidth / 2, moundApexY)
        ctx.lineTo(cx + streamWidth / 2, moundApexY)
        ctx.lineTo(cx + streamWidth / 2, neckY - 2)
        ctx.closePath()
        ctx.fillStyle = streamGrad
        ctx.fill()

        // Spawn falling micro-particles
        if (streamTick % 2 === 0 && streamParticles.length < MAX_STREAM_PARTICLES) {
          streamParticles.push({
            x: cx + (Math.random() - 0.5) * 4,
            y: neckY + 2,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 2.5 + Math.random() * 2.2,
            size: 1.2 + Math.random() * 0.8,
            alpha: 0.8 + Math.random() * 0.2,
            color: SAND_COLORS[Math.floor(Math.random() * SAND_COLORS.length)],
          })
        }

        // Update and draw falling particles
        for (let i = streamParticles.length - 1; i >= 0; i--) {
          const p = streamParticles[i]
          p.x += p.vx
          p.y += p.vy
          p.vy += 0.25 // Gravity acceleration

          if (p.y >= moundApexY) {
            // Impact splash grain
            ctx.fillStyle = p.color
            ctx.globalAlpha = 0.5
            ctx.fillRect(p.x + (Math.random() - 0.5) * 6, moundApexY - Math.random() * 2, 1.2, 1.2)
            ctx.globalAlpha = 1
            streamParticles.splice(i, 1)
          } else {
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.alpha
            ctx.fillRect(p.x, p.y, p.size, p.size)
            ctx.globalAlpha = 1
          }
        }
      }

      // ======================================================================
      // 4. TRANSPARENT GLASS OUTLINE & SPECULAR HIGHLIGHTS (Stationary)
      // ======================================================================
      ctx.save()

      // Outer Glass Profile
      ctx.beginPath()
      // Top lip
      ctx.moveTo(cx - 78, topCapY + 8)
      // Upper bulb left
      ctx.bezierCurveTo(
        cx - 86, topCapY + 50,
        cx - bulbMaxRadius, neckY - 50,
        cx - neckHalfWidth, neckY
      )
      // Lower bulb left
      ctx.bezierCurveTo(
        cx - bulbMaxRadius, neckY + 50,
        cx - 86, bottomCapY - 50,
        cx - 78, bottomCapY - 8
      )
      // Bottom lip
      ctx.lineTo(cx + 78, bottomCapY - 8)
      // Lower bulb right
      ctx.bezierCurveTo(
        cx + 86, bottomCapY - 50,
        cx + bulbMaxRadius, neckY + 50,
        cx + neckHalfWidth, neckY
      )
      // Upper bulb right
      ctx.bezierCurveTo(
        cx + bulbMaxRadius, neckY - 50,
        cx + 86, topCapY + 50,
        cx + 78, topCapY + 8
      )
      ctx.closePath()

      // Glass perimeter line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Left Specular Reflection Streak (curved highlight)
      ctx.beginPath()
      ctx.moveTo(cx - 68, topCapY + 24)
      ctx.bezierCurveTo(
        cx - 76, topCapY + 60,
        cx - bulbMaxRadius + 12, neckY - 55,
        cx - 18, neckY - 14
      )
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.38)'
      ctx.lineWidth = 2.5
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(cx - 18, neckY + 14)
      ctx.bezierCurveTo(
        cx - bulbMaxRadius + 12, neckY + 55,
        cx - 76, bottomCapY - 60,
        cx - 68, bottomCapY - 24
      )
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)'
      ctx.lineWidth = 2.2
      ctx.stroke()

      // Right Edge Thin Rim Highlight
      ctx.beginPath()
      ctx.moveTo(cx + 70, topCapY + 30)
      ctx.bezierCurveTo(
        cx + bulbMaxRadius - 10, topCapY + 80,
        cx + bulbMaxRadius - 10, neckY - 70,
        cx + 20, neckY - 18
      )
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.restore()

      // ======================================================================
      // 5. METALLIC / CARBON ENDCAPS & STRUTS (Permanently Fixed Structure)
      // ======================================================================
      ctx.save()

      // Function to draw metallic caps
      const drawCap = (y: number, isTop: boolean) => {
        // Main base block
        const capWidth = 176
        const capHeight = 12
        const capX = cx - capWidth / 2

        ctx.fillStyle = '#14121F'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
        ctx.lineWidth = 1

        ctx.beginPath()
        ctx.roundRect(capX, y, capWidth, capHeight, 4)
        ctx.fill()
        ctx.stroke()

        // Bevel highlight
        ctx.fillStyle = isTop ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.08)'
        ctx.fillRect(capX + 4, isTop ? y + 1 : y + capHeight - 3, capWidth - 8, 1.5)

        // Brass/Gold trim inlay
        ctx.fillStyle = '#C5A059'
        ctx.fillRect(capX + 16, isTop ? y + capHeight - 2 : y, capWidth - 32, 2)
      }

      drawCap(topCapY - 4, true)
      drawCap(bottomCapY - 8, false)

      // Outer Vertical Struts / Spindles (Left and Right)
      const drawStrut = (x: number) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(x, topCapY + 8)
        ctx.lineTo(x, bottomCapY - 8)
        ctx.stroke()

        // Center brass collar
        ctx.fillStyle = '#C5A059'
        ctx.fillRect(x - 2.5, neckY - 4, 5, 8)
      }

      drawStrut(cx - 82)
      drawStrut(cx + 82)

      ctx.restore()

      if (!prefersReduced) {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [width, height, prefersReduced])

  return (
    <div
      className={`relative select-none flex items-center justify-center ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      aria-label={`Hourglass countdown: ${Math.round(calculatedProgress * 100)}% elapsed`}
    >
      {/* Permanent Fixed Glass Canvas */}
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="pointer-events-none block z-10"
      />

      {/* Atmospheric Soft Sand Ambient Glow (Strictly behind glass, stationary) */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[280px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sand-glow/15 blur-[60px]"
        aria-hidden="true"
      />
    </div>
  )
}

export default HourglassCountdown

