import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

interface CartoonStopwatch3DProps {
  hours: number
  minutes: number
  seconds: number
  position?: [number, number, number]
  scale?: number
}

function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

/**
 * Creates ultra-crisp 1024x1024 circular dial texture for the stopwatch face.
 * Features outer track, 12 radial tick marks, and subtle concentric technical guide rings.
 */
function createStopwatchDialBackground(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1024
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const cx = 512
    const cy = 512
    const r = 492

    // Fill circular white dial
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()

    // Outer subtle bezel ring
    ctx.strokeStyle = '#DCDCD6'
    ctx.lineWidth = 16
    ctx.stroke()

    // Inner subtle guide ring
    ctx.strokeStyle = '#ECECE6'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(cx, cy, r - 64, 0, Math.PI * 2)
    ctx.stroke()

    // 12 Radial tick marks
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2
      const isMajor = i % 3 === 0
      const outerR = r - 24
      const innerR = isMajor ? r - 80 : r - 52

      const x1 = cx + Math.cos(angle) * outerR
      const y1 = cy + Math.sin(angle) * outerR
      const x2 = cx + Math.cos(angle) * innerR
      const y2 = cy + Math.sin(angle) * innerR

      ctx.strokeStyle = isMajor ? '#111111' : '#888888'
      ctx.lineWidth = isMajor ? 14 : 7
      ctx.lineCap = 'round'

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 16
  texture.needsUpdate = true
  return texture
}

/**
 * Creates ultra-crisp digital readout plate texture: HH : MM : SS and HRS · MIN · SEC
 */
function createDigitalTimePlateTexture(
  hours: number,
  minutes: number,
  seconds: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 480
  const ctx = canvas.getContext('2d')

  if (ctx) {
    // Fill plate background with warm white and soft cartoon outline
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.roundRect(12, 12, 1000, 456, 56)
    ctx.fill()

    ctx.strokeStyle = '#D6D6CE'
    ctx.lineWidth = 12
    ctx.stroke()

    // Digital time readout (HH : MM : SS)
    const timeStr = `${pad2(hours)} : ${pad2(minutes)} : ${pad2(seconds)}`
    ctx.fillStyle = '#0F0F0F'
    ctx.font = '900 148px "Chakra Petch", "Geist Mono", monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(timeStr, 512, 184)

    // Sub-labels: HRS · MIN · SEC
    ctx.fillStyle = '#777777'
    ctx.font = 'bold 44px "Geist", sans-serif'
    ctx.letterSpacing = '10px'
    ctx.fillText('HRS   ·   MIN   ·   SEC', 512, 344)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 16
  texture.needsUpdate = true
  return texture
}

export const CartoonStopwatch3D: React.FC<CartoonStopwatch3DProps> = ({
  hours,
  minutes,
  seconds,
  position = [0, -2.45, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const handRef = useRef<THREE.Group>(null)

  // Stopwatch dimensions
  const R = 1.3
  const D = 0.34

  // Textures
  const dialBgTexture = useMemo(() => createStopwatchDialBackground(), [])
  const timePlateTexture = useMemo(
    () => createDigitalTimePlateTexture(hours, minutes, seconds),
    [hours, minutes, seconds]
  )

  // Entrance animation with playful overshoot
  useEffect(() => {
    if (!groupRef.current) return

    groupRef.current.scale.set(0.001, 0.001, 0.001)

    const targetScale = scale
    gsap.to(groupRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.8,
      ease: 'back.out(1.5)',
      delay: 0.35,
    })
  }, [scale])

  // Smooth ticking animation for the stylized second hand
  const targetAngleRef = useRef(0)
  useEffect(() => {
    targetAngleRef.current = -(seconds / 60) * Math.PI * 2
  }, [seconds])

  useFrame((_, delta) => {
    if (!handRef.current) return
    const cur = handRef.current.rotation.z
    const target = targetAngleRef.current
    handRef.current.rotation.z += (target - cur) * Math.min(1, delta * 9)
  })

  return (
    <group ref={groupRef} position={position}>
      {/* ── 1. SUBTLE OUTLINE BACKPLATE (Must rotate [PI/2, 0, 0] to align with casing!) ── */}
      <mesh position={[0, 0, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[R + 0.05, R + 0.05, D - 0.02, 48]} />
        <meshBasicMaterial color="#181818" />
      </mesh>

      {/* ── 2. MAIN WHITE CASING (Cylinder with smooth matte finish) ── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[R, R, D, 48]} />
        <meshStandardMaterial
          color="#F4F4F0"
          roughness={0.48}
          metalness={0.0}
        />
      </mesh>

      {/* ── 3. OUTER BEZEL RING (Soft rounded bevel framing the dial) ── */}
      <mesh position={[0, 0, D / 2]}>
        <torusGeometry args={[R - 0.05, 0.055, 16, 48]} />
        <meshStandardMaterial
          color="#E0E0DA"
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* ── 4. WHITE CIRCULAR DIAL WITH RADIAL TICKS ── */}
      <mesh position={[0, 0, D / 2 + 0.003]}>
        <circleGeometry args={[R - 0.07, 48]} />
        <meshStandardMaterial
          map={dialBgTexture}
          roughness={0.35}
          metalness={0.0}
        />
      </mesh>

      {/* ── 5. PLAYFUL STYLIZED MOVING CLOCK HAND (Sweeps behind digital time plate) ── */}
      <group ref={handRef} position={[0, 0, D / 2 + 0.009]}>
        {/* Main pointer arm extending to tick ring */}
        <mesh position={[0, (R - 0.32) / 2, 0]}>
          <boxGeometry args={[0.022, R - 0.32, 0.006]} />
          <meshStandardMaterial color="#111111" roughness={0.4} />
        </mesh>

        {/* Counter-weight tail */}
        <mesh position={[0, -0.16, 0]}>
          <boxGeometry args={[0.03, 0.22, 0.006]} />
          <meshStandardMaterial color="#2E2E2E" roughness={0.4} />
        </mesh>

        {/* Centre circular pivot pin */}
        <mesh position={[0, 0, 0.004]}>
          <circleGeometry args={[0.055, 24]} />
          <meshStandardMaterial color="#111111" roughness={0.3} />
        </mesh>
      </group>

      {/* ── 6. FLOATING DIGITAL READOUT PLATE (Sits in front of sweeping hand) ── */}
      <group position={[0, 0, D / 2 + 0.016]}>
        {/* Drop shadow plane onto dial */}
        <mesh position={[0, -0.01, -0.004]}>
          <planeGeometry args={[1.65, 0.78]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.15} />
        </mesh>

        {/* Crisp digital time plate */}
        <mesh>
          <planeGeometry args={[1.6, 0.75]} />
          <meshBasicMaterial map={timePlateTexture} />
        </mesh>
      </group>

      {/* ── 7. OVERSIZED TOP PUSHER / CROWN (12 o'clock position) ── */}
      <group position={[0, R + 0.04, 0]}>
        {/* Stem */}
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.16, 20]} />
          <meshStandardMaterial color="#D9D9D9" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Playful chunky button cap */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.17, 0.14, 24]} />
          <meshStandardMaterial color="#282828" roughness={0.5} metalness={0.05} />
        </mesh>

        {/* Side pusher brackets */}
        {[-0.24, 0.24].map((xSide, sIdx) => (
          <group key={sIdx} position={[xSide, -0.06, 0]} rotation={[0, 0, xSide > 0 ? -0.4 : 0.4]}>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.12, 16]} />
              <meshStandardMaterial color="#A0A0A0" roughness={0.4} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ── 8. SOFT CONTACT SHADOW ── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -R - 0.08, 0]}
      >
        <circleGeometry args={[R * 0.75, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

export default CartoonStopwatch3D
