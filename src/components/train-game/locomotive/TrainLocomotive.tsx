import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DriverCabin } from './DriverCabin'
import { getTrackFrameAt } from '../track/trackMath'

interface TrainLocomotiveProps {
  trackProgress: number
  speedKmh: number
  throttlePercent: number
  brakePercent: number
}

export const TrainLocomotive: React.FC<TrainLocomotiveProps> = ({
  trackProgress,
  speedKmh,
  throttlePercent,
  brakePercent,
}) => {
  const trainGroupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!trainGroupRef.current) return

    // Position locomotive on track
    const { position, tangent } = getTrackFrameAt(trackProgress)
    trainGroupRef.current.position.set(position.x, position.y + 0.15, position.z)

    // Orient forward along tangent
    const target = new THREE.Vector3().copy(position).add(tangent)
    trainGroupRef.current.lookAt(target)
  })

  return (
    <group ref={trainGroupRef}>
      {/* Driver Cabin & Dashboard Interior (Camera is inside here!) */}
      <DriverCabin
        speedKmh={speedKmh}
        throttlePercent={throttlePercent}
        brakePercent={brakePercent}
      />

      {/* Exterior Chassis & Wheel Details (Deep Charcoal Navy & Cobalt) */}
      <mesh position={[0, 0.18, 0.4]} receiveShadow>
        <boxGeometry args={[1.5, 0.22, 4.2]} />
        <meshStandardMaterial color="#0F172A" roughness={0.6} />
      </mesh>

      {/* Red Running Boards / Side Trim */}
      <mesh position={[-0.76, 0.22, 0.4]}>
        <boxGeometry args={[0.06, 0.08, 4.0]} />
        <meshStandardMaterial color="#EF4444" roughness={0.4} />
      </mesh>
      <mesh position={[0.76, 0.22, 0.4]}>
        <boxGeometry args={[0.06, 0.08, 4.0]} />
        <meshStandardMaterial color="#EF4444" roughness={0.4} />
      </mesh>

      {/* Front Locomotive Cowcatcher (Vibrant Safety Yellow Wedge) */}
      <mesh position={[0, 0.16, 2.7]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.4, 0.28, 0.35]} />
        <meshStandardMaterial color="#FACC15" roughness={0.4} />
      </mesh>

      {/* Front Golden Headlight Housing (Positioned below windshield sightline) */}
      <mesh position={[0, 0.65, 3.0]} castShadow>
        <cylinderGeometry args={[0.16, 0.19, 0.28, 16]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Front Headlight Lens with Warm Glow */}
      <mesh position={[0, 0.65, 3.15]}>
        <circleGeometry args={[0.14, 16]} />
        <meshStandardMaterial
          color="#FFFBEB"
          emissive="#FEF08A"
          emissiveIntensity={2.5}
        />
      </mesh>
    </group>
  )
}

export default TrainLocomotive
