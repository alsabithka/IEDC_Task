import React, { Suspense, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { CartoonCalendar3D } from './CartoonCalendar3D'
import { CartoonStopwatch3D } from './CartoonStopwatch3D'
import { ReactiveSegmentField } from './ReactiveSegmentField'

interface CountdownInstrumentSceneProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  isMobile?: boolean
  className?: string
}

function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

/**
 * 3D Scene Content:
 * - Desktop/Tablet: Side-by-Side layout (Calendar on LEFT, Stopwatch on RIGHT, vertically centered at y=0)
 * - Mobile (< 768px): Stacked layout
 * - Surrounding short geometric segments that react to mouse pointer
 * - Declarative camera distance that adapts dynamically to viewport aspect ratio
 */
function SceneContent({
  days,
  hours,
  minutes,
  seconds,
  isMobile = false,
}: CountdownInstrumentSceneProps) {
  const { size } = useThree()

  // Desktop and Tablet: Always Side-by-Side!
  // Mobile phones (< 768px): Stacked
  const isStacked = Boolean(isMobile)

  // Dynamic camera framing and instrument placement based on canvas aspect ratio
  const aspect = size.width / Math.max(1, size.height)

  const calX = isStacked ? 0 : aspect < 1.3 ? -1.82 : -2.02
  const stopX = isStacked ? 0 : aspect < 1.3 ? 1.82 : 1.95

  // Side-by-Side: Large dominant Calendar on LEFT, Stopwatch on RIGHT, both centered at y = 0
  // Stacked: Calendar at y = 1.6, Stopwatch at y = -2.0
  const calendarPos: [number, number, number] = isStacked
    ? [0, 1.6, 0]
    : [calX, 0, 0]

  const stopwatchPos: [number, number, number] = isStacked
    ? [0, -2.0, 0]
    : [stopX, 0, 0]

  const cameraZ = isStacked
    ? 9.5
    : aspect < 1.15
      ? 8.75
      : aspect < 1.3
        ? 8.35
        : 7.85
  const cameraY = isStacked ? -0.2 : 0

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, cameraY, cameraZ]}
        fov={48}
      />

      {/* ── STUDIO CARTOON LIGHTING (100% Local, zero network delay) ── */}
      <ambientLight intensity={0.92} color="#FFFFFF" />

      {/* Key directional light with soft shadows */}
      <directionalLight
        position={[4, 6, 6]}
        intensity={1.35}
        color="#FFFFFF"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Soft fill light from left */}
      <directionalLight
        position={[-5, 2, 4]}
        intensity={0.65}
        color="#F0F0EE"
      />

      {/* Under-fill bounce */}
      <directionalLight
        position={[0, -4, 3]}
        intensity={0.35}
        color="#FFFFFF"
      />

      {/* ── SURROUNDING SHORT REACTIVE SEGMENT LINE SYSTEM ── */}
      <ReactiveSegmentField
        isMobile={isMobile}
        calendarX={calendarPos[0]}
        calendarY={calendarPos[1]}
        stopwatchX={stopwatchPos[0]}
        stopwatchY={stopwatchPos[1]}
      />

      {/* ── 1. CARTOON CALENDAR (Dominant instrument on LEFT) ── */}
      <CartoonCalendar3D
        days={days}
        position={calendarPos}
        scale={isStacked ? 1 : 1.12}
      />

      {/* ── 2. CARTOON STOPWATCH (Large, clearly legible on RIGHT) ── */}
      <CartoonStopwatch3D
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        position={stopwatchPos}
        scale={isStacked ? 0.96 : 1.06}
      />
    </>
  )
}

/**
 * Lightweight SVG/HTML fallback for devices without WebGL support or reduced motion
 */
function FallbackInstruments({
  days,
  hours,
  minutes,
  seconds,
  isMobile,
}: CountdownInstrumentSceneProps) {
  return (
    <div
      className={`w-full flex ${
        isMobile ? 'flex-col' : 'flex-row'
      } items-center justify-center gap-6 py-4 select-none`}
    >
      {/* Calendar Card */}
      <div className="w-full max-w-[280px] bg-[#F4F4F0] text-black rounded-2xl p-5 shadow-2xl border-2 border-[#1E1E1E] flex flex-col items-center">
        <div className="w-full flex items-center justify-between pb-2 mb-3 border-b border-[#D0D0D0] text-[10px] font-mono font-bold tracking-widest text-[#555555]">
          <span>● CALENDAR / 01</span>
          <span>EDITION 2026</span>
        </div>
        <div className="font-display font-black text-6xl text-black tabular-nums leading-none py-1">
          {pad2(days)}
        </div>
        <div className="text-[10px] font-sans font-black tracking-[0.22em] text-[#444444] uppercase mt-2">
          DAYS LEFT
        </div>
      </div>

      {/* Stopwatch Card */}
      <div className="w-full max-w-[280px] bg-[#F4F4F0] text-black rounded-2xl p-5 shadow-xl border-2 border-[#1E1E1E] flex flex-col items-center">
        <div className="font-tech font-bold text-3xl text-black tabular-nums tracking-wider py-1">
          {pad2(hours)} : {pad2(minutes)} : {pad2(seconds)}
        </div>
        <div className="text-[10px] font-mono tracking-widest text-[#666666] uppercase mt-2">
          HRS · MIN · SEC
        </div>
      </div>
    </div>
  )
}

export const CountdownInstrumentScene: React.FC<CountdownInstrumentSceneProps> = (props) => {
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
    return <FallbackInstruments {...props} />
  }

  return (
    <div className={`relative w-full h-full ${props.className || ''}`}>
      <Canvas
        shadows
        dpr={[1, props.isMobile ? 1.5 : 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{ width: '100%', height: '100%', background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default CountdownInstrumentScene
