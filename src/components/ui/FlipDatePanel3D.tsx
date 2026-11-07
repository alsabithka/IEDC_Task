import React, { useRef, useMemo, useEffect, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

interface FlipDatePanel3DProps {
  value: string
  width?: number
  height?: number
  depth?: number
  position?: [number, number, number]
}

const CANVAS_W = 1024
const CANVAS_H = 512 // Each half has height 512; combined virtual height = 1024

/**
 * Creates ultra-crisp canvas texture for upper or lower half of the split flap.
 * The number is rendered as ONE massive glyph centered at the crease (y=512 in virtual 1024 space).
 */
function createHalfTexture(
  text: string,
  isTopHalf: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  // Background — matte clean white
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Outer border with subtle rounding inset
  ctx.strokeStyle = '#D4D4CE'
  ctx.lineWidth = 16
  ctx.strokeRect(8, 8, CANVAS_W - 16, CANVAS_H - 16)

  // Giant bold black numeral
  ctx.fillStyle = '#111111'
  ctx.font = '900 640px "Titan One", "Chakra Petch", "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (isTopHalf) {
    // Top canvas: crease is at the BOTTOM edge (y = CANVAS_H)
    // In a 1024 virtual height, center is at 512 (CANVAS_H).
    ctx.fillText(text, CANVAS_W / 2, CANVAS_H)

    // Crease shadow gradient at the bottom edge
    const grad = ctx.createLinearGradient(0, CANVAS_H - 56, 0, CANVAS_H)
    grad.addColorStop(0, 'rgba(0,0,0,0)')
    grad.addColorStop(1, 'rgba(0,0,0,0.22)')
    ctx.fillStyle = grad
    ctx.fillRect(0, CANVAS_H - 56, CANVAS_W, 56)
  } else {
    // Bottom canvas: crease is at the TOP edge (y = 0)
    // In a 1024 virtual height, center is at 0.
    ctx.fillText(text, CANVAS_W / 2, 0)

    // Crease shadow gradient at the top edge
    const grad = ctx.createLinearGradient(0, 0, 0, 56)
    grad.addColorStop(0, 'rgba(0,0,0,0.25)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, CANVAS_W, 56)
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
 * Creates back-face texture for the flipping flap.
 * Inverted so when the top flap flips 180° down over the crease,
 * it reveals the bottom half of the incoming number upright!
 */
function createBackTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  // Rotate 180° around canvas center to flip orientation for back face
  ctx.translate(CANVAS_W, CANVAS_H)
  ctx.rotate(Math.PI)

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  ctx.strokeStyle = '#D4D4CE'
  ctx.lineWidth = 16
  ctx.strokeRect(8, 8, CANVAS_W - 16, CANVAS_H - 16)

  ctx.fillStyle = '#111111'
  ctx.font = '900 640px "Titan One", "Chakra Petch", "Arial Black", sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Center of bottom half is at y = 0
  ctx.fillText(text, CANVAS_W / 2, 0)

  const grad = ctx.createLinearGradient(0, 0, 0, 56)
  grad.addColorStop(0, 'rgba(0,0,0,0.25)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CANVAS_W, 56)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 16
  texture.needsUpdate = true
  return texture
}

interface FlipState {
  prevVal: string
  currentVal: string
  isFlipping: boolean
}

export const FlipDatePanel3D: React.FC<FlipDatePanel3DProps> = ({
  value,
  width = 2.4,
  height = 2.1,
  depth = 0.08,
  position = [0, 0, 0],
}) => {
  const halfH = height / 2

  const [flipState, setFlipState] = useState<FlipState>({
    prevVal: value,
    currentVal: value,
    isFlipping: false,
  })

  // When value changes, trigger flipping transition during render
  if (value !== flipState.currentVal && !flipState.isFlipping) {
    setFlipState({
      prevVal: flipState.currentVal,
      currentVal: value,
      isFlipping: true,
    })
  }

  const flapPivotRef = useRef<THREE.Group>(null)

  // Generate split flap textures
  const topCurrentTex = useMemo(() => createHalfTexture(flipState.currentVal, true), [flipState.currentVal])
  const botCurrentTex = useMemo(() => createHalfTexture(flipState.currentVal, false), [flipState.currentVal])
  const botPrevTex = useMemo(() => createHalfTexture(flipState.prevVal, false), [flipState.prevVal])
  const flapFrontTex = useMemo(() => createHalfTexture(flipState.prevVal, true), [flipState.prevVal])
  const flapBackTex = useMemo(() => createBackTexture(flipState.currentVal), [flipState.currentVal])

  // GSAP 3D physical flip animation
  useEffect(() => {
    if (!flipState.isFlipping || !flapPivotRef.current) return

    flapPivotRef.current.rotation.x = 0

    gsap.to(flapPivotRef.current.rotation, {
      x: -Math.PI,
      duration: 0.58,
      ease: 'back.out(1.35)',
      onComplete: () => {
        setFlipState((prev) => ({
          ...prev,
          prevVal: prev.currentVal,
          isFlipping: false,
        }))
        if (flapPivotRef.current) {
          flapPivotRef.current.rotation.x = 0
        }
      },
    })
  }, [flipState.isFlipping])

  return (
    <group position={position}>
      {/* 1. UPPER STATIC HALF (shows new top value) */}
      <mesh position={[0, halfH / 2 + 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, halfH, depth]} />
        <meshStandardMaterial
          map={topCurrentTex}
          roughness={0.4}
          metalness={0.0}
        />
      </mesh>

      {/* 2. LOWER STATIC HALF (shows previous bottom value while flipping, then current) */}
      <mesh position={[0, -halfH / 2 - 0.008, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, halfH, depth]} />
        <meshStandardMaterial
          map={flipState.isFlipping ? botPrevTex : botCurrentTex}
          roughness={0.4}
          metalness={0.0}
        />
      </mesh>

      {/* Center Crease divider bar behind flaps */}
      <mesh position={[0, 0, depth / 2 + 0.001]}>
        <planeGeometry args={[width + 0.04, 0.024]} />
        <meshBasicMaterial color="#222222" />
      </mesh>

      {/* 3. FLIPPING FLAP (Pivots at crease y=0, rotating from 0 to -PI) */}
      <group
        ref={flapPivotRef}
        position={[0, 0, depth / 2 + 0.004]}
        visible={flipState.isFlipping}
      >
        {/* Front face: shows previous value top half */}
        <mesh position={[0, halfH / 2, 0.002]} castShadow>
          <boxGeometry args={[width, halfH, 0.008]} />
          <meshStandardMaterial
            map={flapFrontTex}
            roughness={0.35}
            metalness={0.0}
          />
        </mesh>

        {/* Back face: shows incoming value bottom half */}
        <mesh position={[0, halfH / 2, -0.002]} castShadow>
          <boxGeometry args={[width, halfH, 0.008]} />
          <meshStandardMaterial
            map={flapBackTex}
            roughness={0.35}
            metalness={0.0}
          />
        </mesh>
      </group>
    </group>
  )
}

export default FlipDatePanel3D
