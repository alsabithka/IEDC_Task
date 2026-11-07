import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CloudData {
  x: number
  y: number
  z: number
  scale: number
  speed: number
  spheres: { offset: [number, number, number]; r: number }[]
}

interface CartoonCloudsProps {
  driftEnabled?: boolean
}

export const CartoonClouds: React.FC<CartoonCloudsProps> = ({ driftEnabled = true }) => {
  const groupRef = useRef<THREE.Group>(null)

  const clouds: CloudData[] = useMemo(() => {
    const list: CloudData[] = []
    const count = 16

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 65 + (i % 5) * 16
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = 22 + (i % 4) * 4

      const spheres = [
        { offset: [0, 0, 0] as [number, number, number], r: 3.2 },
        { offset: [2.2, -0.4, 0.4] as [number, number, number], r: 2.4 },
        { offset: [-2.2, -0.3, -0.3] as [number, number, number], r: 2.3 },
        { offset: [1.1, 1.2, -0.2] as [number, number, number], r: 2.0 },
      ]

      list.push({
        x,
        y,
        z,
        scale: 0.9 + (i % 3) * 0.35,
        speed: 0.2 + (i % 4) * 0.1,
        spheres,
      })
    }
    return list
  }, [])

  // Slowly drift clouds across sky if enabled
  useFrame((_, delta) => {
    if (!driftEnabled || !groupRef.current) return
    groupRef.current.rotation.y += delta * 0.005
  })

  return (
    <group ref={groupRef}>
      {clouds.map((c, idx) => (
        <group
          key={`cloud-${idx}`}
          position={[c.x, c.y, c.z]}
          scale={[c.scale, c.scale * 0.75, c.scale]}
        >
          {c.spheres.map((s, sIdx) => (
            <mesh key={`s-${sIdx}`} position={s.offset} castShadow={false}>
              <sphereGeometry args={[s.r, 8, 6]} />
              <meshStandardMaterial
                color="#FFFFFF"
                roughness={0.95}
                metalness={0.0}
                flatShading
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default CartoonClouds
