import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ReactiveSegmentFieldProps {
  isMobile?: boolean
  calendarX?: number
  calendarY?: number
  stopwatchX?: number
  stopwatchY?: number
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

interface ShortSegment {
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

export const ReactiveSegmentField: React.FC<ReactiveSegmentFieldProps> = ({
  isMobile = false,
  calendarX = -1.85,
  calendarY = 0,
  stopwatchX = 1.85,
  stopwatchY = 0,
}) => {
  const { viewport } = useThree()
  const linesRef = useRef<THREE.LineSegments>(null)
  const nodesRef = useRef<THREE.Points>(null)

  // Track pointer in world coordinates
  const pointerWorldRef = useRef(new THREE.Vector2(9999, 9999))
  const isPointerActiveRef = useRef(false)

  const handlePointerMove = useCallback(
    (e: MouseEvent) => {
      if (isMobile) return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      pointerWorldRef.current.set((nx * viewport.width) / 2, (ny * viewport.height) / 2)
      isPointerActiveRef.current = true
    },
    [isMobile, viewport]
  )

  const handlePointerLeave = useCallback(() => {
    isPointerActiveRef.current = false
    pointerWorldRef.current.set(9999, 9999)
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseleave', handlePointerLeave)
    }
  }, [handlePointerMove, handlePointerLeave])

  // Is side-by-side when calendarX is offset horizontally
  const isSideBySide = Math.abs(calendarX) > 0.5

  // Generate short, refined geometric strokes surrounding the instruments
  const segmentCount = isMobile ? 24 : 46
  const segments = useMemo<ShortSegment[]>(() => {
    const list: ShortSegment[] = []

    for (let i = 0; i < segmentCount; i++) {
      const seedIdx = i * 8
      let ox = 0
      let oy = 0
      const oz = getSeed(seedIdx + 2, -0.15, 0.2)

      if (isSideBySide) {
        // Desktop / Tablet Side-by-Side: distribute around both objects and between them
        const zone = i % 4
        if (zone === 0) {
          // Top perimeter above calendar and stopwatch
          ox = getSeed(seedIdx, calendarX - 1.6, stopwatchX + 1.6)
          oy = getSeed(seedIdx + 1, 2.2, 3.1)
        } else if (zone === 1) {
          // Bottom perimeter below calendar and stopwatch
          ox = getSeed(seedIdx, calendarX - 1.6, stopwatchX + 1.6)
          oy = getSeed(seedIdx + 1, -3.1, -2.2)
        } else if (zone === 2) {
          // Central connection corridor between calendar and stopwatch
          ox = getSeed(seedIdx, calendarX + 1.65, stopwatchX - 1.35)
          oy = getSeed(seedIdx + 1, -1.8, 1.8)
        } else {
          // Outer left/right flanks
          const isLeft = i % 8 < 4
          ox = isLeft
            ? getSeed(seedIdx, calendarX - 2.1, calendarX - 1.65)
            : getSeed(seedIdx, stopwatchX + 1.35, stopwatchX + 2.1)
          oy = getSeed(seedIdx + 1, -1.9, 1.9)
        }
      } else {
        // Stacked mobile layout: distribute around Calendar & Stopwatch
        const isCal = i % 2 === 0
        const cx = isCal ? calendarX : stopwatchX
        const cy = isCal ? calendarY : stopwatchY
        const angle = getSeed(seedIdx, 0, Math.PI * 2)
        const rad = getSeed(seedIdx + 1, isCal ? 1.9 : 1.6, isCal ? 3.2 : 2.7)
        ox = cx + Math.cos(angle) * rad
        oy = cy + Math.sin(angle) * rad
      }

      // Short controlled stroke orientations: horizontal, vertical, or 45° diagonal
      const orientationType = i % 3
      let dir = new THREE.Vector3(1, 0, 0)
      if (orientationType === 1) {
        dir = new THREE.Vector3(0, 1, 0)
      } else if (orientationType === 2) {
        const sign = i % 6 < 3 ? 1 : -1
        dir = new THREE.Vector3(0.707, sign * 0.707, 0).normalize()
      }

      // Short length: 0.20 to 0.48 units (no long scattered sticks!)
      const length = getSeed(seedIdx + 3, 0.2, 0.48)
      const phase = getSeed(seedIdx + 4, 0, Math.PI * 2)
      const speed = getSeed(seedIdx + 5, 0.5, 1.2)
      const baseOpacity = getSeed(seedIdx + 6, 0.32, 0.65)

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
  }, [segmentCount, isSideBySide, calendarX, calendarY, stopwatchX, stopwatchY])

  // Live state per segment for smooth interpolation
  const liveOffsets = useRef(
    segments.map(() => ({
      dx: 0,
      dy: 0,
      rotOffset: 0,
      scaleOffset: 1,
      opacity: 0.35,
    }))
  )

  // Initialize line and node buffer geometries
  const { lineGeo, nodeGeo } = useMemo(() => {
    const linePositions = new Float32Array(segments.length * 6)
    const nodePositions = new Float32Array(segments.length * 6)

    segments.forEach((seg, idx) => {
      const end = seg.baseOrigin.clone().addScaledVector(seg.baseDir, seg.baseLength)
      linePositions.set(
        [seg.baseOrigin.x, seg.baseOrigin.y, seg.baseOrigin.z, end.x, end.y, end.z],
        idx * 6
      )
      // Node at both endpoints creates smooth rounded endpoint aesthetic
      nodePositions.set(
        [seg.baseOrigin.x, seg.baseOrigin.y, seg.baseOrigin.z, end.x, end.y, end.z],
        idx * 6
      )
    })

    const lg = new THREE.BufferGeometry()
    lg.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const ng = new THREE.BufferGeometry()
    ng.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3))

    return { lineGeo: lg, nodeGeo: ng }
  }, [segments])

  // Perimeter corner brackets
  const decorativeBrackets = useMemo(() => {
    const list: THREE.BufferGeometry[] = []
    const spanW = isSideBySide ? 4.5 : 2.4
    const spanH = isSideBySide ? 2.5 : 3.6
    const cornerSize = 0.28

    const corners = [
      // Top-Left
      [
        new THREE.Vector3(-spanW, spanH - cornerSize, 0),
        new THREE.Vector3(-spanW, spanH, 0),
        new THREE.Vector3(-spanW + cornerSize, spanH, 0),
      ],
      // Top-Right
      [
        new THREE.Vector3(spanW - cornerSize, spanH, 0),
        new THREE.Vector3(spanW, spanH, 0),
        new THREE.Vector3(spanW, spanH - cornerSize, 0),
      ],
      // Bottom-Left
      [
        new THREE.Vector3(-spanW, -spanH + cornerSize, 0),
        new THREE.Vector3(-spanW, -spanH, 0),
        new THREE.Vector3(-spanW + cornerSize, -spanH, 0),
      ],
      // Bottom-Right
      [
        new THREE.Vector3(spanW - cornerSize, -spanH, 0),
        new THREE.Vector3(spanW, -spanH, 0),
        new THREE.Vector3(spanW, -spanH + cornerSize, 0),
      ],
    ]

    corners.forEach((pts) => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      list.push(geo)
    })

    return list
  }, [isSideBySide])

  // Mouse interaction loop
  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime()
    const px = pointerWorldRef.current.x
    const py = pointerWorldRef.current.y
    const isPointerActive = isPointerActiveRef.current

    const linePosArray: number[] = []
    const nodePosArray: number[] = []

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]
      const live = liveOffsets.current[i]

      // Idle subtle drift
      const idleX = Math.sin(elapsed * seg.speed + seg.phase) * 0.05
      const idleY = Math.cos(elapsed * (seg.speed * 0.8) + seg.phase + 1) * 0.04
      const idleRot = Math.sin(elapsed * (seg.speed * 0.6) + seg.phase) * 0.06

      let targetDx = idleX
      let targetDy = idleY
      let targetRot = idleRot
      let targetScale = 1.0
      let targetOpacity = seg.baseOpacity

      // Enhanced mouse responsiveness
      if (isPointerActive) {
        const curX = seg.baseOrigin.x + live.dx
        const curY = seg.baseOrigin.y + live.dy
        const dist = Math.hypot(curX - px, curY - py)
        const maxDist = 3.8

        if (dist < maxDist && dist > 0.01) {
          const factor = Math.pow(1 - dist / maxDist, 1.35)

          // Push away noticeably
          const diffX = curX - px
          const diffY = curY - py
          const pushForce = 0.72 * factor

          targetDx += (diffX / dist) * pushForce
          targetDy += (diffY / dist) * pushForce

          // Rotation
          const rotDir = i % 2 === 0 ? 1 : -1
          targetRot += rotDir * factor * 0.65

          // Extend & contract
          targetScale = 1.0 + factor * 0.45 * Math.sin(elapsed * 4 + i) + factor * 0.25

          // Brighten nearby segments
          targetOpacity = Math.min(0.95, seg.baseOpacity + factor * 0.5)
        }
      }

      // Smooth damped interpolation
      const lerpSpeed = Math.min(1.0, delta * 8.5)
      live.dx = lerp(live.dx, targetDx, lerpSpeed)
      live.dy = lerp(live.dy, targetDy, lerpSpeed)
      live.rotOffset = lerp(live.rotOffset, targetRot, lerpSpeed)
      live.scaleOffset = lerp(live.scaleOffset, targetScale, lerpSpeed)
      live.opacity = lerp(live.opacity, targetOpacity, lerpSpeed)

      // Transformed coordinates
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

      linePosArray.push(sx, sy, sz, ex, ey, ez)
      nodePosArray.push(sx, sy, sz, ex, ey, ez)
    }

    if (linesRef.current) {
      const posAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
      posAttr.array.set(linePosArray)
      posAttr.needsUpdate = true
    }

    if (nodesRef.current) {
      const posAttr = nodesRef.current.geometry.attributes.position as THREE.BufferAttribute
      posAttr.array.set(nodePosArray)
      posAttr.needsUpdate = true
    }
  })

  const lineMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#FFFFFF', transparent: true, opacity: 0.45 }),
    []
  )
  const nodeMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#FFFFFF',
        size: 0.055,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      }),
    []
  )
  const accentMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#777777', transparent: true, opacity: 0.38 }),
    []
  )

  return (
    <group>
      {/* Short, refined geometric strokes */}
      <primitive object={new THREE.LineSegments(lineGeo, lineMaterial)} ref={linesRef} />

      {/* Rounded endpoint nodes */}
      <primitive object={new THREE.Points(nodeGeo, nodeMaterial)} ref={nodesRef} />

      {/* Perimeter technical corner brackets */}
      {decorativeBrackets.map((geo, idx) => (
        <primitive key={idx} object={new THREE.Line(geo, accentMaterial)} />
      ))}
    </group>
  )
}

export default ReactiveSegmentField
