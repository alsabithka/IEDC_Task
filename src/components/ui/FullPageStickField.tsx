import React, { useRef, useMemo, useEffect, useCallback, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

interface FullPageStickFieldProps {
  isMobile?: boolean
  className?: string
}

// Pre-seeded deterministic random table (Golden ratio sequence for lint purity)
const SEED_SIZE = 512
const SEED_TABLE = new Float32Array(SEED_SIZE)
for (let i = 0; i < SEED_SIZE; i++) {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453
  SEED_TABLE[i] = v - Math.floor(v)
}

function getSeed(idx: number, min: number, max: number): number {
  const norm = SEED_TABLE[Math.abs(idx) % SEED_SIZE]
  return min + norm * (max - min)
}

interface StickSegment {
  id: number
  baseOrigin: THREE.Vector3
  baseDir: THREE.Vector3
  baseLength: number
  phase: number
  speed: number
  baseOpacity: number
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

/**
 * 3D Scene for the full-page interactive stick effect
 */
function FullPageStickScene({ isMobile = false }: { isMobile?: boolean }) {
  const { viewport } = useThree()
  const linesRef = useRef<THREE.LineSegments>(null)
  const nodesRef = useRef<THREE.Points>(null)

  // Track pointer in world coordinates
  const pointerWorldRef = useRef(new THREE.Vector2(9999, 9999))
  const isPointerActiveRef = useRef(false)

  const updatePointer = useCallback(
    (clientX: number, clientY: number) => {
      const nx = (clientX / window.innerWidth) * 2 - 1
      const ny = -(clientY / window.innerHeight) * 2 + 1
      pointerWorldRef.current.set((nx * viewport.width) / 2, (ny * viewport.height) / 2)
      isPointerActiveRef.current = true
    },
    [viewport.width, viewport.height]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY)
    },
    [updatePointer]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    },
    [updatePointer]
  )

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY)
      }
    },
    [updatePointer]
  )

  const handlePointerEnd = useCallback(() => {
    isPointerActiveRef.current = false
    pointerWorldRef.current.set(9999, 9999)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handlePointerEnd, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handlePointerEnd, { passive: true })
    window.addEventListener('touchcancel', handlePointerEnd, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handlePointerEnd)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handlePointerEnd)
      window.removeEventListener('touchcancel', handlePointerEnd)
    }
  }, [handleMouseMove, handlePointerEnd, handleTouchStart, handleTouchMove])

  // Distribute sticks across the entire viewport
  const segmentCount = isMobile ? 32 : 82

  const segments = useMemo<StickSegment[]>(() => {
    const list: StickSegment[] = []
    const cols = isMobile ? 4 : 10
    const rows = isMobile ? 8 : 8
    const cellW = viewport.width / cols
    const cellH = viewport.height / rows

    for (let i = 0; i < segmentCount; i++) {
      const seedIdx = i * 7
      const col = i % cols
      const row = Math.floor(i / cols) % rows

      // Cell position with jitter across the full viewport
      const jitterX = getSeed(seedIdx, -0.36, 0.36)
      const jitterY = getSeed(seedIdx + 1, -0.36, 0.36)
      const ox = -viewport.width / 2 + (col + 0.5 + jitterX) * cellW
      const oy = -viewport.height / 2 + (row + 0.5 + jitterY) * cellH
      const oz = getSeed(seedIdx + 2, -0.2, 0.1)

      // Short controlled stroke orientations: horizontal, vertical, or 45° diagonal
      const orientationType = i % 3
      let dir = new THREE.Vector3(1, 0, 0)
      if (orientationType === 1) {
        dir = new THREE.Vector3(0, 1, 0)
      } else if (orientationType === 2) {
        const sign = i % 6 < 3 ? 1 : -1
        dir = new THREE.Vector3(0.707, sign * 0.707, 0).normalize()
      }

      // Short length: 0.22 to 0.48 units
      const length = getSeed(seedIdx + 3, 0.22, 0.48)
      const phase = getSeed(seedIdx + 4, 0, Math.PI * 2)
      // Faster idle rhythm as requested
      const speed = getSeed(seedIdx + 5, 0.9, 2.2)
      const baseOpacity = getSeed(seedIdx + 6, 0.38, 0.62)

      list.push({
        id: i,
        baseOrigin: new THREE.Vector3(ox, oy, oz),
        baseDir: dir,
        baseLength: length,
        phase,
        speed,
        baseOpacity,
      })
    }
    return list
  }, [segmentCount, isMobile, viewport.width, viewport.height])

  const liveOffsets = useRef(
    segments.map(() => ({
      dx: 0,
      dy: 0,
      rotOffset: 0,
      scaleOffset: 1,
      opacity: 0.35,
    }))
  )

  useEffect(() => {
    liveOffsets.current = segments.map(() => ({
      dx: 0,
      dy: 0,
      rotOffset: 0,
      scaleOffset: 1,
      opacity: 0.35,
    }))
  }, [segments])

  const { lineGeo, nodeGeo, linePosBuffer, nodePosBuffer } = useMemo(() => {
    const linePositions = new Float32Array(segmentCount * 6)
    const nodePositions = new Float32Array(segmentCount * 6)

    segments.forEach((seg, idx) => {
      const end = seg.baseOrigin.clone().addScaledVector(seg.baseDir, seg.baseLength)
      const ptr = idx * 6
      linePositions[ptr] = seg.baseOrigin.x
      linePositions[ptr + 1] = seg.baseOrigin.y
      linePositions[ptr + 2] = seg.baseOrigin.z
      linePositions[ptr + 3] = end.x
      linePositions[ptr + 4] = end.y
      linePositions[ptr + 5] = end.z

      nodePositions[ptr] = seg.baseOrigin.x
      nodePositions[ptr + 1] = seg.baseOrigin.y
      nodePositions[ptr + 2] = seg.baseOrigin.z
      nodePositions[ptr + 3] = end.x
      nodePositions[ptr + 4] = end.y
      nodePositions[ptr + 5] = end.z
    })

    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    const ng = new THREE.BufferGeometry()
    ng.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))
    return {
      lineGeo: lg,
      nodeGeo: ng,
      linePosBuffer: linePositions,
      nodePosBuffer: nodePositions,
    }
  }, [segments, segmentCount])

  // Zero-allocation high-performance interaction loop
  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime()
    const px = pointerWorldRef.current.x
    const py = pointerWorldRef.current.y
    const isPointerActive = isPointerActiveRef.current

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      const live = liveOffsets.current[i]
      if (!live) continue

      // Faster, more organic ambient drift in idle
      const idleX = Math.sin(elapsed * (seg.speed * 1.5) + seg.phase) * 0.08
      const idleY = Math.cos(elapsed * (seg.speed * 1.25) + seg.phase + 1) * 0.06
      const idleRot = Math.sin(elapsed * (seg.speed * 1.0) + seg.phase) * 0.11

      let targetDx = idleX
      let targetDy = idleY
      let targetRot = idleRot
      let targetScale = 1.0
      let targetOpacity = seg.baseOpacity

      // Dynamic mouse repulsion & response
      if (isPointerActive) {
        const curX = seg.baseOrigin.x + live.dx
        const curY = seg.baseOrigin.y + live.dy
        const dist = Math.hypot(curX - px, curY - py)
        const maxDist = 3.6

        if (dist < maxDist && dist > 0.01) {
          const factor = Math.pow(1 - dist / maxDist, 1.35)
          const diffX = curX - px
          const diffY = curY - py
          const pushForce = 0.65 * factor

          targetDx += (diffX / dist) * pushForce
          targetDy += (diffY / dist) * pushForce

          const rotDir = i % 2 === 0 ? 1 : -1
          targetRot += rotDir * factor * 0.6
          targetScale = 1.0 + factor * 0.4 * Math.sin(elapsed * 4 + i) + factor * 0.2
          targetOpacity = Math.min(0.9, seg.baseOpacity + factor * 0.45)
        }
      }

      const lerpSpeed = Math.min(1.0, delta * 8.5)
      live.dx = lerp(live.dx, targetDx, lerpSpeed)
      live.dy = lerp(live.dy, targetDy, lerpSpeed)
      live.rotOffset = lerp(live.rotOffset, targetRot, lerpSpeed)
      live.scaleOffset = lerp(live.scaleOffset, targetScale, lerpSpeed)
      live.opacity = lerp(live.opacity, targetOpacity, lerpSpeed)

      const sx = seg.baseOrigin.x + live.dx
      const sy = seg.baseOrigin.y + live.dy
      const sz = seg.baseOrigin.z

      const cosR = Math.cos(live.rotOffset)
      const sinR = Math.sin(live.rotOffset)
      const rdx = seg.baseDir.x * cosR - seg.baseDir.y * sinR
      const rdy = seg.baseDir.x * sinR + seg.baseDir.y * cosR
      const currentLength = seg.baseLength * live.scaleOffset

      const ex = sx + rdx * currentLength
      const ey = sy + rdy * currentLength
      const ez = sz

      const ptr = i * 6
      linePosBuffer[ptr] = sx
      linePosBuffer[ptr + 1] = sy
      linePosBuffer[ptr + 2] = sz
      linePosBuffer[ptr + 3] = ex
      linePosBuffer[ptr + 4] = ey
      linePosBuffer[ptr + 5] = ez

      nodePosBuffer[ptr] = sx
      nodePosBuffer[ptr + 1] = sy
      nodePosBuffer[ptr + 2] = sz
      nodePosBuffer[ptr + 3] = ex
      nodePosBuffer[ptr + 4] = ey
      nodePosBuffer[ptr + 5] = ez
    }

    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (nodesRef.current) {
      nodesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.52 }),
    []
  )
  const nodeMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#FFFFFF',
        size: 0.055,
        transparent: true,
        opacity: 0.78,
        sizeAttenuation: true,
      }),
    []
  )

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={48} />
      <group>
        <primitive object={new THREE.LineSegments(lineGeo, lineMaterial)} ref={linesRef} />
        <primitive object={new THREE.Points(nodeGeo, nodeMaterial)} ref={nodesRef} />
      </group>
    </>
  )
}

export const FullPageStickField: React.FC<FullPageStickFieldProps> = ({
  isMobile = false,
  className = '',
}) => {
  const isWebGLAvailable = useMemo(() => {
    if (typeof window === 'undefined') return false
    try {
      const canvas = document.createElement('canvas')
      return Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      )
    } catch {
      return false
    }
  }, [])

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isWebGLAvailable || prefersReducedMotion) {
    return null
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <FullPageStickScene isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default FullPageStickField
