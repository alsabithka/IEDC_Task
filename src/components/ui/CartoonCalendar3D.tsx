import React, { useRef, useMemo, useEffect } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { FlipDatePanel3D } from './FlipDatePanel3D'

interface CartoonCalendar3DProps {
  days: number
  position?: [number, number, number]
  scale?: number
}

function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

/**
 * Creates ultra-crisp header canvas texture: "● CALENDAR / 01" and "EDITION 2026"
 */
function createHeaderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#1A1A1A'
    ctx.fillRect(0, 0, 1200, 200)

    // Left indicator dot + label
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(64, 100, 14, 0, Math.PI * 2)
    ctx.fill()

    ctx.font = 'bold 56px "Geist Mono", "Chakra Petch", monospace'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('CALENDAR / 01', 104, 100)

    // Right label
    ctx.fillStyle = '#CCCCCC'
    ctx.textAlign = 'right'
    ctx.fillText('EDITION 2026', 1136, 100)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 16
  tex.needsUpdate = true
  return tex
}

/**
 * Creates ultra-crisp "DAYS LEFT" canvas texture with dark charcoal typography
 */
function createDaysLeftTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1000
  canvas.height = 240
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#F4F4F0'
    ctx.fillRect(0, 0, 1000, 240)

    ctx.fillStyle = '#2A2A2A'
    ctx.font = '900 88px "Geist", "Inter", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.letterSpacing = '20px'
    ctx.fillText('DAYS LEFT', 500, 120)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 16
  tex.needsUpdate = true
  return tex
}

export const CartoonCalendar3D: React.FC<CartoonCalendar3DProps> = ({
  days,
  position = [0, 0.7, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null)

  // Calendar dimensions — prominent, bold cartoon proportions
  const W = 3.2
  const H = 4.0
  const D = 0.38

  // Textures
  const headerTex = useMemo(() => createHeaderTexture(), [])
  const daysLeftTex = useMemo(() => createDaysLeftTexture(), [])

  // Initial entrance animation with playful overshoot
  useEffect(() => {
    if (!groupRef.current) return

    // Set initial scale
    groupRef.current.scale.set(0.001, 0.001, 0.001)

    const targetScale = scale
    gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.85,
      ease: 'back.out(1.6)',
      delay: 0.15,
    })
  }, [scale])

  const daysStr = pad2(days)

  return (
    <group ref={groupRef} position={position}>
      {/* ── 1. SUBTLE OUTLINE BACKPLATE (Illustrated cartoon boundary) ── */}
      <RoundedBox
        args={[W + 0.1, H + 0.1, D - 0.02]}
        radius={0.24}
        smoothness={6}
        position={[0, 0, -0.01]}
      >
        <meshBasicMaterial color="#181818" />
      </RoundedBox>

      {/* ── 2. MAIN CALENDAR BODY (Matte warm white with rounded bevels) ── */}
      <RoundedBox
        args={[W, H, D]}
        radius={0.22}
        smoothness={6}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#F4F4F0"
          roughness={0.5}
          metalness={0.0}
        />
      </RoundedBox>

      {/* ── 3. HEADER STRIP (Dark band at top of calendar) ── */}
      <mesh position={[0, H / 2 - 0.42, D / 2 + 0.002]}>
        <planeGeometry args={[W - 0.12, 0.52]} />
        <meshStandardMaterial
          map={headerTex}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* ── 4. MECHANICAL FLIP DATE PANEL (Centered in calendar) ── */}
      <FlipDatePanel3D
        value={daysStr}
        width={W * 0.76}
        height={H * 0.44}
        depth={0.08}
        position={[0, 0.05, D / 2 + 0.04]}
      />

      {/* ── 5. "DAYS LEFT" LABEL (Beneath flip panel) ── */}
      <mesh position={[0, -H / 2 + 0.62, D / 2 + 0.002]}>
        <planeGeometry args={[2.2, 0.5]} />
        <meshBasicMaterial map={daysLeftTex} />
      </mesh>

      {/* ── 6. OVERSIZED ROUNDED BINDING RINGS ── */}
      {[-0.85, 0, 0.85].map((xOffset, idx) => (
        <group key={idx} position={[xOffset, H / 2 - 0.02, 0]}>
          {/* Circular mounting grommet / plate on front & back */}
          <mesh
            position={[0, -0.12, D / 2 + 0.01]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.13, 0.13, 0.04, 24]} />
            <meshStandardMaterial color="#242424" roughness={0.6} metalness={0.1} />
          </mesh>

          {/* Oversized smooth binding ring torus */}
          <mesh rotation={[0, 0, 0]} castShadow>
            <torusGeometry args={[0.26, 0.08, 16, 36]} />
            <meshStandardMaterial
              color="#D9D9D9"
              roughness={0.35}
              metalness={0.05}
            />
          </mesh>

          {/* Ring dark highlight ring */}
          <mesh rotation={[0, 0, 0]}>
            <torusGeometry args={[0.26, 0.015, 12, 36]} />
            <meshBasicMaterial color="#777777" />
          </mesh>
        </group>
      ))}

      {/* ── 7. SOFT GROUND CONTACT SHADOW ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -H / 2 - 0.12, 0]}
      >
        <circleGeometry args={[W * 0.55, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>
    </group>
  )
}

export default CartoonCalendar3D

